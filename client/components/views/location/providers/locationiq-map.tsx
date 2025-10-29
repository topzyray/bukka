"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LAGOS } from "@/server/interfaces/Location";
import { Business } from "@/server/interfaces/Business";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useTheme } from "next-themes";
import { BusinessTypeEnum } from "@/server/enums/BusinessTypeEnum";
import { LocationCoordsHelper } from "@/helpers/location-coords-helper";
import Image from "next/image";
import { SearchPlacesWithAutocomplete } from "../search-places-with-autocomplete";
import { envConfig } from "@/configs";
import { useGlobalState } from "@/providers";
import { IconHelper } from "@/helpers/icon-helper";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils";

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

const DEFAULT_CENTER = LAGOS;

const USER_ICON = IconHelper.createColoredIcon(
  "/icons/custom/you.svg",
  "animate-pulse",
  [45, 61]
);

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
  zoom?: number;
  initial?: { lat: number; lng: number } | null;
  height?: string | number;
  disabled?: boolean;
  showLegend?: boolean;
  showSearchPlaces?: boolean;
  businesses?: Business[];
  onSelect: (lat: number, lng: number) => void;
  onMarkerClick?: (businessId: number) => void;
}

export function LocationIQMap({
  initial = null,
  height = 360,
  disabled = false,
  zoom = 13,
  showLegend = false,
  showSearchPlaces = true,
  businesses = [],
  onSelect,
  onMarkerClick,
}: ILocationIQMap) {
  const { coordinates, setCoordinates } = useGlobalState();
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const { theme } = useTheme();
  const geoAttempted = useRef(false);
  const lastEmitted = useRef<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  const debouncedSelect = useMemo(() => debounce(onSelect, 400), [onSelect]);

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
          if (
            !lastEmitted.current ||
            LocationCoordsHelper.coordsDiffer(lastEmitted.current, coords)
          ) {
            lastEmitted.current = coords;
            debouncedSelect(coords.lat, coords.lng);
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
  }, [coordinates, initial, debouncedSelect]);

  useEffect(() => {
    if (!initial || initial.lat == null || initial.lng == null) return;

    if (!marker || LocationCoordsHelper.coordsDiffer(marker, initial)) {
      setMarker((prev) => {
        if (prev && !LocationCoordsHelper.coordsDiffer(prev, initial))
          return prev;
        return initial;
      });

      if (
        !lastEmitted.current ||
        LocationCoordsHelper.coordsDiffer(lastEmitted.current, initial)
      ) {
        lastEmitted.current = initial;
        debouncedSelect(initial.lat, initial.lng);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.lat, initial?.lng, debouncedSelect]);

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
        debouncedSelect(coords.lat, coords.lng);
      }
    } catch {}
  };

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (disabled) return;
      const coords = { lat, lng };
      setMarker(coords);
      setCoordinates(coords);
      if (
        !lastEmitted.current ||
        LocationCoordsHelper.coordsDiffer(lastEmitted.current, coords)
      ) {
        lastEmitted.current = coords;
        debouncedSelect(lat, lng);
      }
    },
    [disabled, debouncedSelect, setCoordinates]
  );

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

  const tileUrl = !envConfig.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
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
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleMapClick} disabled={disabled} />
        {/* <RecenterOnProp lat={marker.lat} lng={marker.lng} /> */}
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

        {businesses.map((b) => {
          const lat = b?.location?.latitude;
          const lng = b?.location?.longitude;
          if (lat == null || lng == null) return null;

          const markerIcon = ICONS[b?.type as BusinessTypeEnum] || ICONS.OTHER;

          return (
            <Marker
              key={b.id}
              position={[lat, lng]}
              icon={markerIcon}
              eventHandlers={{
                // when a marker is clicked, call parent handler
                click: () => {
                  if (onMarkerClick) {
                    try {
                      onMarkerClick(b.id);
                    } catch {
                      // safe no-op
                    }
                  }
                },
              }}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-base">{b?.name}</div>
                  {b?.category && (
                    <div className="text-xs text-muted-foreground">
                      {b.category.name}
                    </div>
                  )}
                  {b?.location?.address && (
                    <div className="text-xs text-muted-foreground">
                      {b.location.address}
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Prefer next/navigation router
                        try {
                          router.push(`/businesses/${b.id}`);
                        } catch {
                          // fallback to window
                          window.location.href = `/businesses/${b.id}`;
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Toggle favorite inline if desired (optional)
                        // You can call a global handler or simply open the details page
                        try {
                          router.push(`/businesses/${b.id}`);
                        } catch {
                          window.location.href = `/businesses/${b.id}`;
                        }
                      }}
                    >
                      Add to Favourite
                    </Button>
                  </div>
                </div>
              </Popup>
              <Tooltip>{b?.name}</Tooltip>
            </Marker>
          );
        })}

        <RecenterButton
          onLocate={(coords) => {
            setMarker(coords);
            setCoordinates(coords);
            debouncedSelect(coords.lat, coords.lng);
          }}
        />
      </MapContainer>

      {showSearchPlaces && (
        <div
          style={{
            zIndex: 499,
          }}
          className="absolute top-2.5 left-12 bg-background backdrop-blur-md rounded-lg shadow-md text-xs overflow-auto flex items-center max-w-[14rem] sm:max-w-[18rem] w-full"
        >
          <SearchPlacesWithAutocomplete />
        </div>
      )}
      {showLegend && (
        <div
          style={{
            zIndex: 499,
          }}
          className="absolute bottom-4.5 right-0.5 bg-background backdrop-blur-md p-2 rounded shadow-md text-xs space-y-2 max-h-60 sm:max-h-max overflow-auto"
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
                  className="w-5 h-5"
                />
                <span>{key.replace(/_/g, " ")}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RecenterButton({
  onLocate,
}: {
  onLocate: (coords: { lat: number; lng: number }) => void;
}) {
  const map = useMap();
  const { setCoordinates } = useGlobalState();
  const [locating, setLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocate = () => {
    // ✅ If we already have a user location, just re-center (don’t fetch again)
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true });
      toast.info("Centered on your location");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUserLocation(coords);
        setCoordinates(coords);
        map.flyTo([coords.lat, coords.lng], 16, { animate: true });
        onLocate(coords);

        toast.success("Located your position");
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.error("Unable to get your location");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="absolute top-2.5 right-2.5 z-[499]">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleLocate}
        onContextMenu={(e) => {
          e.preventDefault();
          setUserLocation(null);
          toast("Next click will fetch your live location again");
        }}
        className="relative hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full"
        title="Go to my location"
      >
        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse-ring" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className={cn(
            "w-10 h-10 text-primary drop-shadow-sm",
            "animate-spin-slow text-blue-500"
          )}
        >
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M10.5 21.5a1 1 0 0 0 1.1.23l7-2.8a1 1 0 0 0 .55-.55l2.8-7a1 1 0 0 0-1.33-1.33l-7 2.8a1 1 0 0 0-.55.55l-2.8 7a1 1 0 0 0 .23 1.1Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </div>
  );
}

export async function fetchLocationIQRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  mode: "driving" | "walking" | "cycling" = "driving"
) {
  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  if (!apiKey) throw new Error("LocationIQ API key missing");

  const url = `https://us1.locationiq.com/v1/directions/driving/${start.lng},${start.lat};${end.lng},${end.lat}?key=${apiKey}&overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch route from LocationIQ");
  const data = await res.json();

  const route = data.routes?.[0];
  if (!route) throw new Error("No route found");

  const { distance, duration, geometry } = route;
  return {
    coordinates: geometry.coordinates.map(([lng, lat]: [number, number]) => [
      lat,
      lng,
    ]),
    distance, // in meters
    duration, // in seconds
  };
}
