"use client";

import { STORE_KEYS } from "@/configs";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Coordinate {
  lat: number;
  lng: number;
}

interface CachedLocation {
  coords: Coordinate;
  timestamp: number;
}

interface UserLocationContextType {
  coordinates: Coordinate | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

const UserLocationContext = createContext<UserLocationContextType>({
  coordinates: null,
  loading: true,
  error: null,
  refreshLocation: () => {},
});

interface IUserLocationProvider {
  children: React.ReactNode;
  cacheDurationMs?: number;
}

export const UserLocationProvider = ({
  children,
  cacheDurationMs = 60 * 60 * 1000, // 1 hour default
}: IUserLocationProvider) => {
  const [coordinates, setCoordinates] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      const cached = localStorage.getItem(STORE_KEYS.USER_LAST_LOCATION);
      if (cached) {
        try {
          const parsed: CachedLocation = JSON.parse(cached);
          const isExpired = Date.now() - parsed.timestamp > cacheDurationMs;

          if (!isExpired && parsed.coords?.lat && parsed.coords?.lng) {
            setCoordinates(parsed.coords);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(STORE_KEYS.USER_LAST_LOCATION);
          }
        } catch {}
      }
    }

    // Fallback to geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const data: CachedLocation = {
            coords: newCoords,
            timestamp: Date.now(),
          };
          localStorage.setItem(
            STORE_KEYS.USER_LAST_LOCATION,
            JSON.stringify(data)
          );

          setCoordinates(newCoords);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshLocation = () => fetchLocation(true); // Force prompt again

  //   useEffect(() => {
  //     if (!navigator.geolocation) {
  //       setError("Geolocation is not supported by this browser.");
  //       setLoading(false);
  //       return;
  //     }

  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  //         setLoading(false);
  //       },
  //       (err) => {
  //         setError(err.message || "Unable to retrieve coordinates.");
  //         setLoading(false);
  //       },
  //       { enableHighAccuracy: true }
  //     );
  //   }, []);

  const value = { coordinates, loading, error, refreshLocation };
  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const ctx = useContext(UserLocationContext);
  if (!ctx)
    throw new Error("useUserLocation must be used within UseLocationProvider");
  return ctx;
};
