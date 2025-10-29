"use client";

import { LocationCoordsHelper } from "@/helpers/location-coords-helper";
import { useUserLocation } from "@/providers";
import { useEffect, useState } from "react";

interface UseDistanceOptions {
  targetLat?: number;
  targetLng?: number;
  userLat?: number;
  userLng?: number;
  autoDetectUserLocation?: boolean;
  format?: boolean;
}

export function useDistance({
  targetLat,
  targetLng,
  format = true,
}: UseDistanceOptions) {
  const { coordinates: userLocation, loading } = useUserLocation();
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [bearing, setBearing] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation && targetLat && targetLng) {
      const km = LocationCoordsHelper.calculateDistanceKm({
        lat1: userLocation.lat,
        lon1: userLocation.lng,
        lat2: targetLat,
        lon2: targetLng,
      });
      const direction = LocationCoordsHelper.calculateBearing(
        userLocation.lat,
        userLocation.lng,
        targetLat,
        targetLng
      );
      setDistanceKm(km);
      setBearing(direction);
    }
  }, [userLocation, targetLat, targetLng]);

  if (!format) {
    return { distanceKm, bearing, loading };
  }

  let formatted: string;

  if (loading) {
    formatted = "Detecting your location...";
  } else if (distanceKm === null) {
    formatted = "Distance unavailable";
  } else if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    formatted = `${meters} m away${bearing ? ` (${bearing})` : ""}`;
  } else {
    formatted = `Within ${distanceKm.toFixed(1)} km${
      bearing ? ` ${bearing}` : ""
    } of your location`;
  }

  return { distanceKm, formatted, loading };
}
