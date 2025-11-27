"use client";

import dynamic from "next/dynamic";
import React, { useCallback } from "react";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { BusinessApiService } from "@/data/services/BusinessApiService";
import { useCustomInfiniteQuery } from "@/data/queries/base";
import { Business } from "@/data/interfaces/Business";
import { QueryKeyEnum } from "@/data/enums";

type Props = {
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
}: Props) {
  const PAGE_SIZE = 10;

  const { data: infiniteData } = useCustomInfiniteQuery<Business>(
    [QueryKeyEnum.BUSINESSES],
    ({ pageNumber }) =>
      BusinessApiService.getBusinesses({
        page: pageNumber,
        limit: PAGE_SIZE,
      }),
    {
      params: { limit: PAGE_SIZE },
      initialPageParam: 1,
      enabled: true,
    }
  );

  const findPage = useCallback(
    (pn: number) => {
      return infiniteData?.pages?.find((p) => p.pageNumber === pn);
    },
    [infiniteData?.pages]
  );

  const currentPageData = React.useMemo(() => {
    // const pageObj = findPage(100) ?? infiniteData?.pages?.[0];
    const pageObj = infiniteData?.pages?.[0];
    return pageObj?.data ?? [];
  }, [infiniteData?.pages]);

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
          zoom={zoom}
          initial={initial}
          onSelect={onSelect}
          height={height}
          showSearchPlaces={showSearchPlaces}
          syncQuery={syncQuery}
          businesses={currentPageData || businesses}
          showLegend={showLegend}
          onMarkerClick={onMarkerClick}
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
