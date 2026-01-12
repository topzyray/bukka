"use client";

import { memo, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";

import { Business } from "@/data/interfaces/Business";
import { IconHelper } from "@/helpers/icon-helper";

export const ClusterLayer = memo(function ClusterLayer({
  businesses,
  onMarkerClick,
}: {
  businesses: Business[];
  onMarkerClick?: (id: number) => void;
}) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const iconCache = useRef<Record<string, L.Icon>>({});

  const getIcon = (type: string) => {
    if (!iconCache.current[type]) {
      iconCache.current[type] = IconHelper.createColoredIcon(
        `/icons/pin/${type.toLowerCase()}.svg`
      );
    }
    return iconCache.current[type];
  };

  useEffect(() => {
    if (!map) return;

    if (!clusterRef.current) {
      clusterRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: false,
      });

      clusterRef.current.on("clusterclick", (e: any) => {
        map.fitBounds(e.layer.getBounds(), {
          padding: [80, 80],
          animate: true,
        });
      });

      map.addLayer(clusterRef.current);
    }

    const cluster = clusterRef.current;
    cluster.clearLayers();

    for (const b of businesses) {
      const lat = b.location?.latitude;
      const lng = b.location?.longitude;
      if (lat == null || lng == null) continue;

      const icon = getIcon(b.type);

      const marker = L.marker([lat, lng], { icon });
      marker.on("click", () => onMarkerClick?.(b.id));
      cluster.addLayer(marker);
    }

    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
        clusterRef.current.clearLayers();
        clusterRef.current = null;
      }
    };
  }, [map, businesses, onMarkerClick]);

  return null;
});

ClusterLayer.displayName = "ClusterLayer";
