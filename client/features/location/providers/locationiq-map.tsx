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
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import { debounce } from "@/utils";
import { envConfig } from "@/configs";
import { useTheme } from "next-themes";
import { LAGOS } from "@/data/interfaces/Location";
import { IconHelper } from "@/helpers/icon-helper";
import { Business } from "@/data/interfaces/Business";
import { useGlobalState, useUserLocation } from "@/providers";
import { CustomZoomControl } from "../components/custom-zoom";
import { RecenterButton } from "../components/recenter-button";
import { usePathname, useSearchParams } from "next/navigation";
import { BusinessTypeEnum } from "@/data/enums/BusinessTypeEnum";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { LocationCoordsHelper } from "@/helpers/location-coords-helper";
import { SearchPlacesWithAutocomplete } from "../search-places-with-autocomplete";
import { BusinessPopUp } from "../components/business-pop-up";
import { MyLocationPopUp } from "../components/my-location-pop-up";
import { PinBusinessPopUp } from "../components/pin-business-pop-up";

const ICONS: Record<Partial<BusinessTypeEnum | string>, L.Icon> = {
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
    `/icons/pin/${"default"}.svg`
  ),
  [BusinessTypeEnum.CATERING]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.FAST_FOOD.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.BAKERY]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.BAKERY.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.FOOD_VENDOR]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.FAST_FOOD.toLowerCase()}.svg`
  ),
  [BusinessTypeEnum.STREET_EATRY]: IconHelper.createColoredIcon(
    `/icons/pin/${BusinessTypeEnum.FAST_FOOD.toLowerCase()}.svg`
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

const CURRENT_CLICK_ICON = IconHelper.createColoredIcon(
  "/icons/custom/you.svg",
  "animate-pulse",
  [45, 61]
);

const USER_LOCATION_ICON = IconHelper.createColoredIcon(
  "/icons/flat/you.svg",
  "animate-pulse",
  [45, 61]
);

const DEFAULT_CENTER = LAGOS;

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
  syncQuery?: boolean;
  businesses?: Business[];
  onSelect: (lat: number, lng: number) => void;
  onMarkerClick?: (businessId: number) => void;
}

function RecenterOnMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  return null;
}

export function LocationIQMap({
  initial = null,
  height = 360,
  disabled = false,
  zoom = 13,
  showLegend = false,
  showSearchPlaces = true,
  syncQuery = false,
  businesses = [],
  onSelect,
  onMarkerClick,
}: ILocationIQMap) {
  const icons = useMemo(() => ICONS, []);

  const { coordinates, setCoordinates } = useGlobalState();
  const { userCoordinates } = useUserLocation();

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const { theme } = useTheme();
  const geoAttempted = useRef(false);
  const lastEmitted = useRef<{ lat: number; lng: number } | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const debouncedSelect = useMemo(() => debounce(onSelect, 400), [onSelect]);

  useEffect(() => {
    if (!syncQuery) return;

    const q = searchParams.get("q");
    if (q) {
      const parts = q.split(",");
      if (parts.length === 2) {
        const [lat, lng] = parts.map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMarker({ lat, lng });
          debouncedSelect(lat, lng);
        }
      }
    }
  }, [syncQuery, searchParams, debouncedSelect]);

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

    if (userCoordinates) {
      setMarker(userCoordinates);
      if (
        !lastEmitted.current ||
        LocationCoordsHelper.coordsDiffer(lastEmitted.current, userCoordinates)
      ) {
        lastEmitted.current = userCoordinates;
        debouncedSelect(userCoordinates.lat, userCoordinates.lng);
      }
      return;
    }

    setMarker(DEFAULT_CENTER);
  }, [coordinates, initial, debouncedSelect, userCoordinates]);

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

  const updateQuery = useCallback(
    (lat: number, lng: number) => {
      if (!syncQuery) return;
      const newQuery = `?q=${lat.toFixed(7)},${lng.toFixed(7)}`;
      // router.replace(`${pathname}${newQuery}`, { scroll: false });
      window.history.replaceState(null, "", `${pathname}${newQuery}`);
    },
    [syncQuery, pathname]
  );

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
      updateQuery(lat, lng);
      if (
        !lastEmitted.current ||
        LocationCoordsHelper.coordsDiffer(lastEmitted.current, coords)
      ) {
        lastEmitted.current = coords;
        debouncedSelect(lat, lng);
      }
    },
    [disabled, setCoordinates, updateQuery, debouncedSelect]
  );

  const tileUrl = useMemo(() => {
    return !envConfig.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
      ? `https://{s}-tiles.locationiq.com/v3/${
          theme === "light" ? "streets" : "dark"
        }/r/{z}/{x}/{y}.png?key=${
          envConfig.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN
        }`
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }, []);

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

  return (
    <div
      style={{ height, maxHeight: "100%" }}
      className="relative w-full rounded-md overflow-hidden"
    >
      <MapContainer
        center={[marker.lat, marker.lng]}
        zoomControl={false}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <CustomZoomControl />
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onClick={handleMapClick} disabled={disabled} />
        <RecenterOnMarker lat={marker.lat} lng={marker.lng} />
        <Marker
          position={[marker.lat, marker.lng]}
          draggable={!disabled}
          eventHandlers={{ dragend: handleDragEnd }}
          icon={CURRENT_CLICK_ICON}
        >
          <Popup>
            <PinBusinessPopUp lat={marker.lat} lng={marker.lng} />
          </Popup>
        </Marker>

        {userCoordinates?.lat && userCoordinates?.lng && (
          <Marker
            position={[userCoordinates?.lat, userCoordinates?.lng]}
            draggable={false}
            // eventHandlers={{ dragend: handleDragEnd }}
            icon={USER_LOCATION_ICON}
          >
            <Popup>
              <MyLocationPopUp
                lat={userCoordinates.lat}
                lng={userCoordinates.lng}
              />
            </Popup>
          </Marker>
        )}

        {businesses.map((business) => {
          const lat = business?.location?.latitude;
          const lng = business?.location?.longitude;
          if (lat == null || lng == null) return null;

          const markerIcon =
            icons[business?.type as BusinessTypeEnum] || icons.OTHER;
          return (
            <Marker
              bubblingMouseEvents
              key={business?.id}
              position={[lat, lng]}
              icon={markerIcon}
              eventHandlers={{
                // when a marker is clicked, call parent handler
                click: () => {
                  if (onMarkerClick) {
                    try {
                      onMarkerClick(business?.id);
                    } catch {
                      // safe no-op
                    }
                  }
                  if (syncQuery && business?.location) {
                    updateQuery(
                      business?.location?.latitude,
                      business?.location?.longitude
                    );
                  }
                },
              }}
            >
              <Popup className="sm:w-sm">
                <BusinessPopUp business={business} className="sm:w-86" />
                {/* <BusinessPopUp business={business} /> */}
              </Popup>
              <Tooltip>{business?.name}</Tooltip>
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
        <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 bg-background backdrop-blur-md rounded-lg shadow-md text-xs overflow-auto flex items-center max-w-56 sm:max-w-[18rem] w-full">
          <SearchPlacesWithAutocomplete />
        </div>
      )}
      {showLegend && (
        <div className="absolute bottom-4.5 right-0.5 bg-background backdrop-blur-md p-2 rounded shadow-md text-xs space-y-2 max-h-60 sm:max-h-max overflow-auto">
          {Object.entries(icons).map(([key]) => {
            let icon: string = `/icons/pin/${key.toLowerCase()}.svg`;
            switch (key) {
              case BusinessTypeEnum.OTHER:
                icon = "/icons/pin/default.svg";
                break;
              case BusinessTypeEnum.CATERING:
              case BusinessTypeEnum.FOOD_VENDOR:
              case BusinessTypeEnum.STREET_EATRY:
                icon = "/icons/pin/fast_food.svg";
                break;
              case BusinessTypeEnum.LOUNGE:
                icon = "/icons/pin/default.svg";
                break;
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

// export async function fetchLocationIQRoute(
//   start: { lat: number; lng: number },
//   end: { lat: number; lng: number },
//   mode: "driving" | "walking" | "cycling" = "driving"
// ) {
//   const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
//   if (!apiKey) throw new Error("LocationIQ API key missing");

//   const url = `https://us1.locationiq.com/v1/directions/driving/${start.lng},${start.lat};${end.lng},${end.lat}?key=${apiKey}&overview=full&geometries=geojson`;

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Failed to fetch route from LocationIQ");
//   const data = await res.json();

//   const route = data.routes?.[0];
//   if (!route) throw new Error("No route found");

//   const { distance, duration, geometry } = route;
//   return {
//     coordinates: geometry.coordinates.map(([lng, lat]: [number, number]) => [
//       lat,
//       lng,
//     ]),
//     distance, // in meters
//     duration, // in seconds
//   };
// }
