"use client";

import { LAGOS, LatLng } from "@/server/interfaces/Location";
import { useEffect, useState } from "react";
import Map, { Marker as MapboxMarker } from "react-map-gl/mapbox";

export function MapboxMap({
  initial,
  onSelect,
  disabled,
  height = 360,
}: {
  initial?: LatLng | null;
  onSelect: (lat: number, lng: number) => void;
  disabled?: boolean;
  height?: number | string;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [marker, setMarker] = useState<LatLng | null>(initial ?? null);

  useEffect(() => setMarker(initial ?? null), [initial]);

  if (!token) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        Missing NEXT_PUBLIC_MAPBOX_TOKEN
      </div>
    );
  }

  const center = marker ?? initial ?? LAGOS;

  return (
    <div style={{ height }} className="w-full">
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 13,
        }}
        style={{ width: "100%", height: "100%" }}
        onClick={(e: any) => {
          if (disabled) return;
          const lat = e.lngLat.lat;
          const lng = e.lngLat.lng;
          setMarker({ lat, lng });
          onSelect(lat, lng);
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {marker && (
          <MapboxMarker latitude={marker.lat} longitude={marker.lng} />
        )}
      </Map>
    </div>
  );
}
