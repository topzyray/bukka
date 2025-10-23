import "leaflet/dist/leaflet.css";
import { LAGOS, LatLng } from "@/server/interfaces/Location";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "/icons/custom/marker.svg";
import markerIcon from "/icons/custom/marker2.svg";
import markerShadow from "/icons/custom/marker.svg";

// // Fix marker icon issues in many setups
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    typeof window !== "undefined" ? markerIcon2x.src ?? markerIcon2x : "",
  iconUrl: typeof window !== "undefined" ? markerIcon.src ?? markerIcon : "",
  shadowUrl:
    typeof window !== "undefined" ? markerShadow.src ?? markerShadow : "",
});

export function LeafletMap({
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
  const [center, setCenter] = useState<LatLng | null>(initial ?? null);
  const [marker, setMarker] = useState<LatLng | null>(initial ?? null);

  // useEffect(() => {
  //   if (!initial) {
  //     // try user location
  //     if (typeof navigator !== "undefined" && navigator.geolocation) {
  //       const id = navigator.geolocation.getCurrentPosition(
  //         (pos) => {
  //           const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  //           setCenter(p);
  //           setMarker(p);
  //         },
  //         () => {
  //           setCenter(LAGOS);
  //         },
  //         { enableHighAccuracy: true, timeout: 5000 }
  //       );
  //       return () => {
  //         // no cleanup for getCurrentPosition
  //       };
  //     } else {
  //       setCenter(LAGOS);
  //     }
  //   } else {
  //     setCenter(initial);
  //     setMarker(initial);
  //   }
  // }, [initial]);

  useEffect(() => {
    if (initial) {
      // If parent provides coordinates (e.g., user clicked "Use my location"), update center
      setCenter(initial);
      setMarker(initial);
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      // Try fetching user location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(p);
          setMarker(p);
        },
        (err) => {
          console.warn("Geolocation failed:", err);
          // Do NOT fallback to Lagos, just leave map at default zoom (user can click to select)
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 } // increase timeout
      );
    }
  }, [initial]);

  if (!MapContainer || !TileLayer || !Marker || !useMapEvents) {
    return <div style={{ height }}>Loading map...</div>;
  }

  function MapClickHandler() {
    useMapEvents({
      click(e: any) {
        if (disabled) return;
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const p = { lat, lng };
        setMarker(p);
        onSelect(lat, lng);
      },
    });
    return null;
  }

  return (
    <div style={{ height }} className="w-full">
      <MapContainer
        center={center ?? LAGOS}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {marker && <Marker position={[marker.lat, marker.lng]} />}
      </MapContainer>
    </div>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// // Fix marker icon issues in many setups
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     typeof window !== "undefined" ? markerIcon2x.src ?? markerIcon2x : "",
//   iconUrl: typeof window !== "undefined" ? markerIcon.src ?? markerIcon : "",
//   shadowUrl:
//     typeof window !== "undefined" ? markerShadow.src ?? markerShadow : "",
// });

// type Props = {
//   initial?: { lat: number; lng: number } | null;
//   onSelect: (lat: number, lng: number) => void;
//   height?: string | number;
//   className?: string;
// };

// function ClickHandler({
//   onSelect,
// }: {
//   onSelect: (lat: number, lng: number) => void;
// }) {
//   useMapEvents({
//     click(e) {
//       onSelect(e.latlng.lat, e.latlng.lng);
//     },
//   });
//   return null;
// }

// export default function LeafletMap({
//   initial = null,
//   onSelect,
//   height = 360,
// }: Props) {
//   const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
//     initial ?? null
//   );

//   useEffect(() => {
//     setMarker(initial ?? null);
//   }, [initial]);

//   const handleSelect = (lat: number, lng: number) => {
//     setMarker({ lat, lng });
//     onSelect(lat, lng);
//   };

//   return (
//     <div style={{ height }}>
//       <MapContainer
//         center={
//           marker ?? { lat: initial?.lat ?? 6.5244, lng: initial?.lng ?? 3.3792 }
//         }
//         zoom={11}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <ClickHandler onSelect={handleSelect} />
//         {marker && <Marker position={[marker.lat, marker.lng]} />}
//       </MapContainer>
//     </div>
//   );
// }
