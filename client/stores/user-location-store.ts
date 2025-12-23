"use client";

import { create } from "zustand";
import { STORE_KEYS } from "@/configs";

export interface Coordinate {
  lat: number;
  lng: number;
}

interface CachedLocation {
  coords: Coordinate;
  timestamp: number;
}

interface UserLocationState {
  userCoordinates: Coordinate | null;
  loading: boolean;
  error: string | null;

  fetchLocation: (forceRefresh?: boolean) => void;
  refreshUserLocation: () => void;
  setUserCoordinates: (coords: Coordinate | null) => void;
}

export const useUserLocationStore = create<UserLocationState>((set, get) => ({
  userCoordinates: null,
  loading: false,
  error: null,

  setUserCoordinates: (coords) => set({ userCoordinates: coords }),

  fetchLocation: (forceRefresh = false) => {
    set({ loading: true, error: null });

    const cacheDurationMs = 60 * 60 * 1000;

    if (!forceRefresh) {
      const cached = localStorage.getItem(STORE_KEYS.USER_LAST_LOCATION);
      if (cached) {
        try {
          const parsed: CachedLocation = JSON.parse(cached);
          const isExpired = Date.now() - parsed.timestamp > cacheDurationMs;

          if (!isExpired && parsed.coords?.lat && parsed.coords?.lng) {
            set({ userCoordinates: parsed.coords, loading: false });
            return;
          }
        } catch {}
      }
    }

    if (!("geolocation" in navigator)) {
      set({
        error: "Geolocation is not supported by your browser.",
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        localStorage.setItem(
          STORE_KEYS.USER_LAST_LOCATION,
          JSON.stringify({
            coords,
            timestamp: Date.now(),
          })
        );

        set({ userCoordinates: coords, loading: false });
      },
      (err) => {
        set({ error: err.message, loading: false });
      },
      { enableHighAccuracy: true }
    );
  },

  refreshUserLocation: () => {
    get().fetchLocation(true);
  },
}));
