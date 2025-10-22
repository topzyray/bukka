"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LAGOS } from "@/server/interfaces/Location";
import { Business } from "@/server/interfaces/Business";
import { Badge } from "@/components/ui/badge";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useTheme } from "next-themes";

type Props = {
  initial?: { lat: number; lng: number } | null;
  onSelect: (lat: number, lng: number) => void;
  height?: string | number;
  disabled?: boolean;
  businesses?: Business[];
};

const DEFAULT_CENTER = LAGOS; // Lagos fallback

// once-only icon (avoid re-creating every render)
const DEFAULT_ICON = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "",
});

const LOCAL_DEFAULT_ICON = L.icon({
  iconUrl: "/icons/marker2.svg",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [45, 61],
  iconAnchor: [12, 41],
  className: "",
});

L.Marker.prototype.options.icon = LOCAL_DEFAULT_ICON;

// Helper to avoid tiny float noise
function coordsDiffer(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  eps = 1e-5
) {
  return Math.abs(a.lat - b.lat) > eps || Math.abs(a.lng - b.lng) > eps;
}

function RecenterOnProp({ lat, lng }: { lat: number; lng: number }) {
  // useMap gives access to the existing map instance (no re-inits)
  const map = useMap();
  const last = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!lat && !lng) return;
    const newCenter = { lat, lng };
    if (!last.current || coordsDiffer(last.current, newCenter)) {
      // only call setView if center truly changed (prevents continuous recenters)
      try {
        map.setView([lat, lng], map.getZoom(), { animate: true });
        last.current = newCenter;
      } catch {
        // ignore
      }
    }
  }, [lat, lng, map]);

  return null;
}

/** Map click handler (declarative) */
function MapClickHandler({
  onClick,
  disabled,
}: {
  onClick: (lat: number, lng: number) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationIQMap({
  initial = null,
  onSelect,
  height = 360,
  disabled = false,
  businesses = [],
}: Props) {
  // marker is local state controlled by this provider. Parent can update `initial` to move it.
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const { theme } = useTheme();

  // track whether we've already attempted geolocation (prevent double attempts in Strict Mode)
  const geoAttempted = useRef(false);

  // keep last emitted coordinates to avoid double-calling parent for the same coords
  const lastEmitted = useRef<{ lat: number; lng: number } | null>(null);

  // Initialize: if initial provided, use it. Otherwise attempt geolocation once, else fallback to default.
  useEffect(() => {
    if (initial && initial.lat != null && initial.lng != null) {
      setMarker(initial);
      return;
    }
    if (geoAttempted.current) return;
    geoAttempted.current = true;

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMarker(coords);
          // emit to parent so parent can reverse-geocode if required
          if (
            !lastEmitted.current ||
            coordsDiffer(lastEmitted.current, coords)
          ) {
            lastEmitted.current = coords;
            onSelect(coords.lat, coords.lng);
          }
        },
        () => {
          // fallback
          setMarker(DEFAULT_CENTER);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setMarker(DEFAULT_CENTER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to external `initial` prop changes (e.g., after user selects from search)
  // Only update marker and emit if coords differ meaningfully.
  useEffect(() => {
    if (!initial) return;
    if (!marker || coordsDiffer(marker, initial)) {
      setMarker(initial);
      if (!lastEmitted.current || coordsDiffer(lastEmitted.current, initial)) {
        lastEmitted.current = initial;
        onSelect(initial.lat, initial.lng);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // Drag-end handler (Marker) — update marker and emit
  const handleDragEnd = (e: L.LeafletEvent) => {
    if (disabled) return;
    try {
      const markerLeaflet = e.target as L.Marker;
      const ll = markerLeaflet.getLatLng();
      const coords = { lat: ll.lat, lng: ll.lng };
      setMarker(coords);
      if (!lastEmitted.current || coordsDiffer(lastEmitted.current, coords)) {
        lastEmitted.current = coords;
        onSelect(coords.lat, coords.lng);
      }
    } catch {
      // ignore errors
    }
  };

  // Click-to-set coordinates -> set marker and emit
  const handleMapClick = (lat: number, lng: number) => {
    if (disabled) return;
    const coords = { lat, lng };
    setMarker(coords);
    if (!lastEmitted.current || coordsDiffer(lastEmitted.current, coords)) {
      lastEmitted.current = coords;
      onSelect(lat, lng);
    }
  };

  if (!marker) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-sm text-muted-foreground"
      >
        <CircularLoader text="Loading map..." />
      </div>
    );
  }

  const tileUrl = !process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
    ? `https://{s}-tiles.locationiq.com/v3/${
        theme === "light" ? "streets" : "dark"
      }/r/{z}/{x}/{y}.png?key=${
        process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
      }`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div
      style={{ height, maxHeight: "100%" }}
      className="w-full rounded-md overflow-hidden"
    >
      <MapContainer
        center={[marker.lat, marker.lng]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleMapClick} disabled={disabled} />
        <RecenterOnProp lat={marker.lat} lng={marker.lng} />
        <Marker
          position={[marker.lat, marker.lng]}
          draggable={!disabled}
          eventHandlers={{ dragend: handleDragEnd }}
        >
          <Popup>
            <div className="text-sm">
              {disabled
                ? "Location locked"
                : "Drag or click to update location"}
            </div>
          </Popup>
        </Marker>

        {businesses.map((b) => (
          <Marker
            key={b.id}
            position={[b?.location?.latitude, b?.location?.longitude]}
          >
            <Popup>
              <div className="flex flex-col">
                <h2 className="text-primary text-xl font-bold">{b?.name}</h2>
                {b?.category && <p>{b?.category?.name}</p>}
                {b?.location?.address && (
                  <p className="text-xs text-muted-foreground">
                    {b?.location?.address}
                  </p>
                )}
                <div className="flex gap-2">
                  <Badge className="cursor-pointer">View Details</Badge>
                  <Badge className="cursor-pointer">Add to Favourite</Badge>
                </div>
              </div>
            </Popup>
            <Tooltip>{b?.name}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import L from "leaflet";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMap,
//   useMapEvents,
//   Popup,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { LAGOS, LatLng } from "@/server/interfaces/Location";

// type Props = {
//   initial?: LatLng | null;
//   disabled?: boolean;
//   onSelect: (lat: number, lng: number, meta?: { placeId?: string }) => void;
//   height?: number | string;
//   placeId?: string | null;
// };

// // ✅ Move icon definition outside component to avoid recreation
// const DefaultIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// function Recenter({ lat, lng }: { lat: number; lng: number }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView([lat, lng], map.getZoom(), { animate: true });
//   }, [lat, lng, map]);
//   return null;
// }

// export function LocationIQMap({
//   initial,
//   onSelect,
//   disabled = false,
//   height = 360,
//   placeId = null,
// }: Props) {
//   const [marker, setMarker] = useState<LatLng | null>(initial ?? null);
//   const [userLocated, setUserLocated] = useState(false);
//   const geoAttemptedRef = useRef(false);

//   // Initialize marker if not provided
//   useEffect(() => {
//     setMarker(initial ?? null);
//   }, [initial]);

//   // Geolocation — only once
//   useEffect(() => {
//     if (geoAttemptedRef.current || initial) return;
//     geoAttemptedRef.current = true;

//     if (typeof navigator === "undefined" || !navigator.geolocation) {
//       setMarker(LAGOS);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
//         setMarker(coords);
//         setUserLocated(true);
//         onSelect(coords.lat, coords.lng, { placeId: placeId ?? undefined });
//       },
//       () => setMarker(LAGOS),
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   }, [initial, onSelect, placeId]);

//   // Click-to-select
//   function MapClickHandler() {
//     useMapEvents({
//       click(e) {
//         if (disabled) return;
//         const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
//         setMarker(coords);
//         onSelect(coords.lat, coords.lng, { placeId: placeId ?? undefined });
//       },
//     });
//     return null;
//   }

//   // Marker handler
//   function DraggableMarker() {
//     if (!marker) return null;

//     return (
//       <Marker
//         draggable={!disabled}
//         position={[marker.lat, marker.lng]}
//         eventHandlers={{
//           dragend: (e) => {
//             const { lat, lng } = e.target.getLatLng();
//             setMarker({ lat, lng });
//             onSelect(lat, lng, { placeId: placeId ?? undefined });
//           },
//         }}
//       >
//         <Popup>
//           <div className="text-sm">
//             {disabled
//               ? "Location is locked"
//               : userLocated
//               ? "You are here"
//               : "Drag or click to fine-tune"}
//           </div>
//         </Popup>
//       </Marker>
//     );
//   }

//   const center = marker ?? LAGOS;

//   return (
//     <div style={{ height }} className="w-full rounded-md overflow-hidden">
//       <MapContainer
//         center={[center.lat, center.lng]}
//         zoom={13}
//         scrollWheelZoom
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//           url={
//             process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
//               ? `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN}`
//               : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           }
//         />

//         <MapClickHandler />
//         {marker && <Recenter lat={center.lat} lng={center.lng} />}
//         {marker && <DraggableMarker />}
//       </MapContainer>
//     </div>
//   );
// }

// "use client";

// import { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// type Props = {
//   initial?: { lat: number; lng: number } | null;
//   onSelect: (lat: number, lng: number) => void;
//   height?: string | number;
// };

// function Recenter({ lat, lng }: { lat: number; lng: number }) {
//   const map = useMap();

//   useEffect(() => {
//     if (lat && lng) {
//       map.setView([lat, lng], map.getZoom(), { animate: true });
//     }
//   }, [lat, lng, map]);

//   return null;
// }

// export function LocationIQMap({ initial, onSelect, height = 360 }: Props) {
//   const defaultCenter = initial ?? { lat: 6.5244, lng: 3.3792 }; // Lagos fallback

//   // Default Leaflet marker icon fix (needed if markers don't show)
//   const DefaultIcon = L.icon({
//     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//   });
//   L.Marker.prototype.options.icon = DefaultIcon;

//   return (
//     <div style={{ height }}>
//       <MapContainer
//         center={defaultCenter}
//         zoom={13}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         />
//         {initial && <Recenter lat={initial.lat} lng={initial.lng} />}
//         <Marker
//           position={[defaultCenter.lat, defaultCenter.lng]}
//           draggable
//           eventHandlers={{
//             dragend: (e) => {
//               const { lat, lng } = e.target.getLatLng();
//               onSelect(lat, lng);
//             },
//           }}
//         />
//       </MapContainer>
//     </div>
//   );
// }
