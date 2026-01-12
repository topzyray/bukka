"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { STORE_KEYS } from "@/configs";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { EventHelper } from "@/helpers/event-helper";

export interface Coordinate {
  lat: number;
  lng: number;
}

interface CachedLocation {
  coords: Coordinate;
  accuracy: number;
  timestamp: number;
}

interface IUserLocationContext {
  loading: boolean;
  userCoordinates: Coordinate | null;
  accuracy?: number;
  isOfflineFallback?: boolean;
  error: string | null;
  refreshUserLocation: () => void;
  ensureFreshLocation: () => Promise<Coordinate | null>;
}

const UserLocationContext = createContext<IUserLocationContext>(
  {} as IUserLocationContext
);

interface IUserLocationProvider {
  children: React.ReactNode;
  cacheDurationMs?: number;
  autoRefreshMs?: number;
}

export const UserLocationProvider = ({
  children,
  cacheDurationMs = 10 * 60 * 1000, // 10 minutes default - for "live"
  autoRefreshMs = 5 * 60 * 1000, // 5 minutes
}: IUserLocationProvider) => {
  const pathname = usePathname();
  const status = useAuthStore.getState().status;

  const [userCoordinates, setUserCoordinates] = useState<Coordinate | null>(
    null
  );
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackToastShown, setFallbackToastShown] = useState(false);

  const getCachedLocation = (): CachedLocation | null => {
    try {
      const cached = localStorage.getItem(STORE_KEYS.USER_LAST_LOCATION);
      if (!cached) return null;
      return JSON.parse(cached) as CachedLocation;
    } catch {
      return null;
    }
  };

  const saveCachedLocation = (data: CachedLocation) => {
    try {
      localStorage.setItem(STORE_KEYS.USER_LAST_LOCATION, JSON.stringify(data));
    } catch {}
  };

  const showFallbackToast = () => {
    if (!fallbackToastShown) {
      toast("Using last known location.", {
        description: "Some results may be outdated.",
      });
      setFallbackToastShown(true);
    }
  };

  const fetchLocation = useCallback(
    async (forceRefresh = false): Promise<Coordinate | null> => {
      setLoading(true);
      setError(null);
      setIsOfflineFallback(false);

      const cached = getCachedLocation();

      if (!forceRefresh && cached && !navigator.onLine) {
        setFallbackToastShown(false);
      }

      if (!navigator.onLine) {
        if (cached) {
          setIsOfflineFallback(true);
          setUserCoordinates(cached.coords);
          setAccuracy(cached.accuracy);
          setLoading(false);
          showFallbackToast();
          return Promise.resolve(cached.coords);
        }
        setError("Offline and no cached location available.");
        setLoading(false);
        return Promise.resolve(null);
      }

      if (!forceRefresh && cached) {
        const isExpired = Date.now() - cached.timestamp > cacheDurationMs;

        if (!isExpired) {
          setUserCoordinates(cached.coords);
          setAccuracy(cached.accuracy);
          setLoading(false);
          return Promise.resolve(cached.coords);
        }
      }

      if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported.");
        setLoading(false);
        if (cached) {
          setIsOfflineFallback(true);
          showFallbackToast();
          return Promise.resolve(cached.coords);
        } // offline fallback
        return Promise.resolve(null);
      }

      try {
        // Check for permission status first
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });
          if (permission.state === "denied") {
            setError("Geolocation access denied.");
            setLoading(false);
            if (cached) {
              setIsOfflineFallback(true);
              showFallbackToast();
              return Promise.resolve(cached.coords);
            }
            return Promise.resolve(null);
          }
        }
      } catch {
        // Permissions API not supported, proceed to request
      }

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const acc = position.coords.accuracy;

            saveCachedLocation({
              coords,
              accuracy: position.coords.accuracy,
              timestamp: Date.now(),
            });

            setUserCoordinates(coords);
            setAccuracy(acc);
            setIsOfflineFallback(false);
            setLoading(false);
            resolve(coords);
          },
          (err) => {
            setError(err.message ?? "Failed to retrieve location.");
            setLoading(false);
            if (cached) {
              setIsOfflineFallback(true);
              setUserCoordinates(cached.coords);
              setAccuracy(cached.accuracy);
              showFallbackToast();
              resolve(cached.coords); // fallback to cached coords
            } else {
              resolve(null);
            }
          },
          { enableHighAccuracy: true }
        );
      });
    },
    [cacheDurationMs]
  );

  /*
   * POINT OF USAGE:
   * Place order	await ensureFreshLocation()
   * Confirm delivery	await ensureFreshLocation()
   * Directions / visit	await ensureFreshLocation()
   */
  const ensureFreshLocation = async (): Promise<Coordinate | null> => {
    const cached = getCachedLocation();

    if (!cached) {
      return await fetchLocation(true);
    }

    const isExpired = Date.now() - cached.timestamp > cacheDurationMs;
    const isLowAccuracy = cached.accuracy > 1000; // meters

    if ((!navigator.onLine && cached) || isExpired || isLowAccuracy) {
      if (!navigator.onLine) {
        setIsOfflineFallback(true);
        toast("Using last known location (offline)", {
          description: "Some results may be outdated.",
        });
        setUserCoordinates(cached.coords);
        setAccuracy(cached.accuracy);
        return cached.coords;
      }
      return await fetchLocation(true);
    }

    setUserCoordinates(cached.coords);
    setAccuracy(cached.accuracy);
    setIsOfflineFallback(false);
    return cached.coords;
  };

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // Auto-refresh only if dashboard and session active
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!pathname?.startsWith("/dashboard")) return;

    const interval = setInterval(() => {
      if (status === "authenticated") {
        ensureFreshLocation().catch(() => {});
      }
    }, autoRefreshMs);

    return () => clearInterval(interval);
  }, [pathname, autoRefreshMs, ensureFreshLocation, status]);

  // Stop auto-refresh on multi-tab logout
  useEffect(() => {
    const stopLocationUpdates = () => {
      setLoading(false);
      setUserCoordinates(null);
      setAccuracy(undefined);
    };

    EventHelper.listenForLogout(stopLocationUpdates);
    return () => {
      // nothing to clean here; EventHelper handles channel cleanup if needed in the future
    };
  }, []);

  const value = React.useMemo(
    () => ({
      loading,
      userCoordinates,
      accuracy,
      isOfflineFallback,
      error,
      refreshUserLocation: () => fetchLocation(true),
      ensureFreshLocation,
    }),
    [
      loading,
      userCoordinates,
      accuracy,
      isOfflineFallback,
      error,
      fetchLocation,
      ensureFreshLocation,
    ]
  );

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const ctx = useContext(UserLocationContext);
  if (!ctx)
    throw new Error("useUserLocation must be used within UserLocationProvider");
  return ctx;
};
