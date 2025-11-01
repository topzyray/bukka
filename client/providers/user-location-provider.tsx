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

interface IUserLocationContext {
  userCoordinates: Coordinate | null;
  setUserCoordinates: React.Dispatch<React.SetStateAction<Coordinate | null>>;
  loading: boolean;
  error: string | null;
  refreshUserLocation: () => void;
}

const UserLocationContext = createContext<IUserLocationContext>(
  {} as IUserLocationContext
);

interface IUserLocationProvider {
  children: React.ReactNode;
  cacheDurationMs?: number;
}

export const UserLocationProvider = ({
  children,
  cacheDurationMs = 60 * 60 * 1000, // 1 hour default
}: IUserLocationProvider) => {
  const [userCoordinates, setUserCoordinates] = useState<Coordinate | null>(
    null
  );
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
            setUserCoordinates(parsed.coords);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(STORE_KEYS.USER_LAST_LOCATION);
          }
        } catch {}
      }
    }

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

          setUserCoordinates(newCoords);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshUserLocation = () => fetchLocation(true);

  const value = {
    userCoordinates,
    setUserCoordinates,
    loading,
    error,
    refreshUserLocation,
  };
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
