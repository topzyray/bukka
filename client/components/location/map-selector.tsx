"use client";

import dynamic from "next/dynamic";
import { MapProviderEnum } from "@/server/enums/MapProviderEnum";
import { BusinessApiService } from "@/server/services/BusinessApiService";
import { useCustomInfiniteQuery } from "@/server/queries/base";
import { Business } from "@/server/interfaces/Business";
import React, { useCallback } from "react";

type Props = {
  initial?: { lat: number; lng: number } | null;
  onSelect: (lat: number, lng: number) => void;
  provider: MapProviderEnum;
  showLegend?: boolean;
  height?: string | number;
};

export function MapSelector({
  initial = null,
  onSelect,
  provider,
  showLegend,
  height,
}: Props) {
  const PAGE_SIZE = 10;

  const { data: infiniteData } = useCustomInfiniteQuery<Business>(
    ["businesses"],
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
    const pageObj = findPage(100) ?? infiniteData?.pages?.[0];
    return pageObj?.data ?? [];
  }, [findPage, infiniteData?.pages]);

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

    case MapProviderEnum.LEAFLET:
    case MapProviderEnum.OPEN_STREET_MAP: {
      const LeafletMap = dynamic(
        () => import("./providers/leaflet-map").then((m) => m.LeafletMap),
        { ssr: false }
      );
      return (
        <LeafletMap initial={initial} onSelect={onSelect} height={height} />
      );
    }

    case MapProviderEnum.LOCATIONIQ: {
      const LocationIQMap = dynamic(
        () => import("./providers/locationiq-map").then((m) => m.LocationIQMap),
        { ssr: false }
      );
      return (
        <LocationIQMap
          initial={initial}
          onSelect={onSelect}
          height={height}
          businesses={currentPageData}
          showLegend={showLegend}
        />
      );
    }

    case MapProviderEnum.MAPBOX: {
      const MapboxMap = dynamic(
        () => import("./providers/mapbox-map").then((m) => m.MapboxMap),
        { ssr: false }
      );
      return (
        <MapboxMap initial={initial} onSelect={onSelect} height={height} />
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
