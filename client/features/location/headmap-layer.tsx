"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { Business } from "@/data/interfaces/Business";

export function HeatmapLayer({
  businesses,
  enabled,
}: {
  businesses: Business[];
  enabled: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    const points = businesses
      .map((b) => {
        const lat = b.location?.latitude;
        const lng = b.location?.longitude;
        if (!lat || !lng) return null;
        return [lat, lng, 0.7] as [number, number, number];
      })
      .filter(Boolean) as [number, number, number][];

    if (points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 16,
      minOpacity: 0.4,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [enabled, businesses, map]);

  return null;
}
