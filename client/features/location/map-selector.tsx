"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef } from "react";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { Business } from "@/data/interfaces/Business";
import { MapBounds } from "@/data/interfaces/MapBounds";
import { useBusinessesByBounds } from "@/data/queries/use-businesses-query";
import { debounce } from "@/utils";
import { useIsMobile } from "@/hooks";

type IMapSelectorProps = {
  zoom?: number;
  initial?: { lat: number; lng: number } | null;
  provider: MapProviderEnum;
  showLegend?: boolean;
  showSearchPlaces?: boolean;
  syncQuery?: boolean;
  height?: string | number;
  businesses?: Business[];
  onSelect: (lat: number, lng: number) => void;
  onMarkerClick?: (id: number) => void;
};

export function MapSelector({
  zoom,
  initial = null,
  provider,
  showLegend,
  syncQuery,
  showSearchPlaces,
  height,
  businesses,
  onSelect,
  onMarkerClick,
}: IMapSelectorProps) {
  const PAGE_SIZE = 300;

  const isMobile = useIsMobile();
  const ZOOM = zoom ?? (isMobile ? 13 : 13);

  const boundsRef = useRef<MapBounds | null>(null);

  const filters = useMemo(() => ({}), []);

  const {
    data,
    isLoading,
    refetch: refetchBusinesses,
  } = useBusinessesByBounds({
    getBounds: () => boundsRef.current,
    filters,
    pageSize: PAGE_SIZE,
    enabled: false,
  });

  const fetchedBusinesses = useMemo(
    () => data?.responseData?.data ?? [],
    [data]
  );

  const businessData = useMemo(() => {
    if (fetchedBusinesses.length > 0) return fetchedBusinesses;
    return businesses ?? [];
  }, [fetchedBusinesses, businesses]);

  const debouncedFetch = useMemo(
    () => debounce(refetchBusinesses, 300),
    [refetchBusinesses]
  );

  const handleBoundsChange = useCallback(
    (b: MapBounds) => {
      boundsRef.current = b;
      debouncedFetch();
    },
    [debouncedFetch]
  );

  switch (provider) {
    case MapProviderEnum.GOOGLE: {
      const GoogleMap = dynamic(
        () => import("./providers/google-map").then((m) => m.GoogleMap),
        { ssr: false }
      );
      return (
        <GoogleMap initial={initial} onSelect={onSelect} height={height} />
      );
    }
    case MapProviderEnum.LOCATIONIQ: {
      const LocationIQMap = dynamic(
        () => import("./providers/locationiq-map").then((m) => m.LocationIQMap),
        { ssr: false }
      );
      return (
        <LocationIQMap
          zoom={ZOOM}
          initial={initial}
          height={height}
          showLegend={showLegend}
          showSearchPlaces={showSearchPlaces}
          syncQuery={syncQuery}
          mapBusinesses={businessData}
          onSelect={onSelect}
          onMarkerClick={onMarkerClick}
          onBoundsChange={handleBoundsChange}
          isLoading={isLoading}
        />
      );
    }
    default:
      return (
        <div
          style={{ height }}
          className="flex items-center justify-center text-sm text-muted-foreground"
        >
          Unsupported map provider
        </div>
      );
  }
}
