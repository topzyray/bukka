import { LAGOS, LatLng } from "@/server/interfaces/Location";
import { useEffect, useState } from "react";
import Map, { Marker as MapboxMarker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export function MaplibreMap({
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
        initialViewState={{
          latitude: center?.lat,
          longitude: center?.lng,
          zoom: 13,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://api.maptiler.com/maps/streets-v4/style.json?key=LqDbrXc6OPC9uJTDhqmz"
        onClick={(e: any) => {
          if (disabled) return;
          const { lngLat } = e;
          const lat = lngLat[1];
          const lng = lngLat[0];
          const p = { lat, lng };
          setMarker(p);
          onSelect(lat, lng);
        }}
      >
        {marker && (
          <MapboxMarker longitude={marker.lng} latitude={marker.lat} />
        )}
      </Map>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
// import "mapbox-gl/dist/mapbox-gl.css";

// type Props = {
//   initial?: { lat: number; lng: number } | null;
//   onSelect: (lat: number, lng: number) => void;
//   height?: string | number;
//   className?: string;
// };

// export default function MapboxMap({
//   initial = null,
//   onSelect,
//   height = 360,
//   className,
// }: Props) {
//   const [marker, setMarker] = React.useState(initial ?? null);
//   const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

//   const handleClick = (event: mapboxgl.MapLayerMouseEvent) => {
//     const { lng, lat } = event.lngLat;
//     setMarker({ lat, lng });
//     onSelect(lat, lng);
//   };

//   return (
//     <div style={{ height }}>
//       <Map
//         mapboxAccessToken={token}
//         initialViewState={{
//           latitude: marker?.lat ?? initial?.lat ?? 6.5244,
//           longitude: marker?.lng ?? initial?.lng ?? 3.3792,
//           zoom: 11,
//         }}
//         style={{ width: "100%", height }}
//         mapStyle="mapbox://styles/mapbox/streets-v11"
//         onClick={handleClick}
//       >
//         <NavigationControl />
//         {marker && <Marker longitude={marker.lng} latitude={marker.lat} />}
//       </Map>
//     </div>
//   );
// }
