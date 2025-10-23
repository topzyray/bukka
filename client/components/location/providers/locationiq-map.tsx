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
import { BusinessTypeEnum } from "@/server/enums/BusinessTypeEnum";
import { LocationCoordsHelper } from "@/helpers/location-coords-helper";
import Image from "next/image";
import { SearchPlacesWithAutocomplete } from "../search-places-with-autocomplete";
import { envConfig } from "@/configs";
import { useGlobalState } from "@/providers";
import { IconHelper } from "@/helpers/icon-helper";

const ICONS: Record<BusinessTypeEnum, L.Icon> = {
  [BusinessTypeEnum.RESTAURANT]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.RESTAURANT.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.FAST_FOOD]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.FAST_FOOD.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.BAR]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.BAR.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.LOUNGE]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.LOUNGE.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.CATERING]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.CATERING.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.BAKERY]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.BAKERY.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.FOOD_VENDOR]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.FOOD_VENDOR.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.STREET_EATRY]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.STREET_EATRY.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.GROCERY]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.GROCERY.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.DELIVERY_SERVICE]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.DELIVERY_SERVICE.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.OTHER]: IconHelper.createColoredIcon(
    `/icons/pin/default.svg`
  ),
};

const DEFAULT_CENTER = LAGOS; // Lagos fallback

// once-only icon (avoid re-creating every render)
// const DEFAULT_ICON = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   className: "",
// });

// const LOCAL_DEFAULT_ICON = L.icon({
//   iconUrl: "/icons/marker2.svg",
//   iconRetinaUrl: "/icons/marker2.svg",
//   shadowUrl: "/icons/marker-shadow.png",
//   iconSize: [45, 61],
//   iconAnchor: [12, 41],
//   className: "",
// });

const USER_ICON = IconHelper.createColoredIcon(
  "/icons/custom/you.svg",
  "animate-pulse",
  [45, 61]
);

// L.Marker.prototype.options.icon = LOCAL_DEFAULT_ICON;

function RecenterOnProp({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const last = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!lat && !lng) return;
    const newCenter = { lat, lng };
    if (
      !last.current ||
      LocationCoordsHelper.coordsDiffer(last.current, newCenter)
    ) {
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

interface ILocationIQMap {
  initial?: { lat: number; lng: number } | null;
  onSelect: (lat: number, lng: number) => void;
  height?: string | number;
  disabled?: boolean;
  businesses?: Business[];
}

export function LocationIQMap({
  initial = null,
  onSelect,
  height = 360,
  disabled = false,
  businesses = [],
}: ILocationIQMap) {
  const { coordinates } = useGlobalState();
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const { theme } = useTheme();
  const geoAttempted = useRef(false);
  const lastEmitted = useRef<{ lat: number; lng: number } | null>(null);

  // Initialize: if initial provided, use it. Otherwise attempt geolocation once, else fallback to default.
  useEffect(() => {
    if (coordinates) {
      setMarker(coordinates);
      return;
    }
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
            LocationCoordsHelper.coordsDiffer(lastEmitted.current, coords)
          ) {
            lastEmitted.current = coords;
            onSelect(coords.lat, coords.lng);
          }
        },
        () => {
          setMarker(DEFAULT_CENTER);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setMarker(DEFAULT_CENTER);
    }
  }, [coordinates, initial, onSelect]);

  useEffect(() => {
    if (!initial) return;
    if (!marker || LocationCoordsHelper.coordsDiffer(marker, initial)) {
      setMarker(initial);
      if (
        !lastEmitted.current ||
        LocationCoordsHelper.coordsDiffer(lastEmitted.current, initial)
      ) {
        lastEmitted.current = initial;
        onSelect(initial.lat, initial.lng);
      }
    }
  }, [initial, marker, onSelect]);

  const handleDragEnd = (e: L.LeafletEvent) => {
    if (disabled) return;
    try {
      const markerLeaflet = e.target as L.Marker;
      const ll = markerLeaflet.getLatLng();
      const coords = { lat: ll.lat, lng: ll.lng };
      setMarker(coords);
      if (
        !lastEmitted.current ||
        LocationCoordsHelper.coordsDiffer(lastEmitted.current, coords)
      ) {
        lastEmitted.current = coords;
        onSelect(coords.lat, coords.lng);
      }
    } catch {}
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (disabled) return;
    const coords = { lat, lng };
    setMarker(coords);
    if (
      !lastEmitted.current ||
      LocationCoordsHelper.coordsDiffer(lastEmitted.current, coords)
    ) {
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

  const tileUrl = envConfig.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
    ? `https://{s}-tiles.locationiq.com/v3/${
        theme === "light" ? "streets" : "dark"
      }/r/{z}/{x}/{y}.png?key=${envConfig.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div
      style={{ height, maxHeight: "100%" }}
      className="relative w-full rounded-md overflow-hidden"
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
          icon={USER_ICON}
        >
          <Popup>
            <div className="text-sm">
              <p>
                {disabled
                  ? "Location locked"
                  : "Drag or click to update location"}
              </p>
            </div>
          </Popup>
        </Marker>

        {businesses.map((b) => (
          <Marker
            key={b.id}
            position={[b?.location?.latitude, b?.location?.longitude]}
            icon={ICONS[b?.type as BusinessTypeEnum] || ICONS.OTHER}
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

      <div
        style={{
          zIndex: 499,
        }}
        className="absolute top-2.5 left-12 bg-background backdrop-blur-md rounded-lg shadow-md text-xs overflow-auto flex items-center max-w-[18rem] w-full"
      >
        <SearchPlacesWithAutocomplete />
      </div>

      <div
        style={{
          zIndex: 499,
        }}
        className="absolute bottom-5 right-2 bg-background backdrop-blur-md p-2 rounded shadow-md text-xs space-y-2 max-h-max overflow-auto"
      >
        {Object.entries(ICONS).map(([key]) => {
          let icon: string = `/icons/pin/${key.toLowerCase()}.svg`;
          switch (key) {
            case BusinessTypeEnum.OTHER:
              icon = "/icons/pin/default.svg";
            case BusinessTypeEnum.CATERING:
              icon = "/icons/pin/fast_food.svg";
            case BusinessTypeEnum.LOUNGE:
              icon = "/icons/pin/default.svg";
            case BusinessTypeEnum.FOOD_VENDOR:
              icon = "/icons/pin/fast_food.svg";
            case BusinessTypeEnum.STREET_EATRY:
              icon = "/icons/pin/fast_food.svg";
            default:
              break;
          }
          return (
            <div key={key} className="flex items-center gap-1">
              <Image
                src={icon}
                alt={key}
                width={16}
                height={16}
                className="w-6 h-6"
              />
              <span>{key.replace(/_/g, " ")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
