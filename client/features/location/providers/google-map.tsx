"use client";

import { useEffect, useState } from "react";
import { LAGOS, LatLng } from "@/data/interfaces/Location";
import {
  GoogleMap as GMap,
  Marker as GMarker,
  useJsApiLoader,
} from "@react-google-maps/api";

export function GoogleMap({
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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const [marker, setMarker] = useState<LatLng | null>(initial ?? null);

  useEffect(() => setMarker(initial ?? null), [initial]);

  if (!apiKey) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        Missing NEXT_PUBLIC_GOOGLE_MAPS_KEY
      </div>
    );
  }

  const center = marker ?? initial ?? LAGOS;

  if (!isLoaded) return <div style={{ height }}>Loading map...</div>;

  return (
    <div style={{ height }} className="w-full">
      <GMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={center}
        zoom={13}
        onClick={(e: google.maps.MapMouseEvent) => {
          if (disabled || !e.latLng) return;
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setMarker({ lat, lng });
          onSelect(lat, lng);
        }}
      >
        {marker && (
          <GMarker
            draggable
            position={marker}
            onDragEnd={(e) => {
              if (!e.latLng) return;
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setMarker({ lat, lng });
              onSelect(lat, lng);
            }}
          />
        )}
      </GMap>
    </div>
  );
}
