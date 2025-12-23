"use client";

import { MapBounds } from "@/data/interfaces/MapBounds";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const EPS = 1e-4; // ~10m

function closeEnough(a: number, b: number) {
  return Math.abs(a - b) <= EPS;
}

interface BoundsWatcherProps {
  onBoundsChanged: (bounds: MapBounds) => void;
}

export function BoundsWatcher({ onBoundsChanged }: BoundsWatcherProps) {
  const map = useMap();
  const last = useRef<MapBounds | null>(null);

  useEffect(() => {
    const handle = () => {
      const b = map.getBounds();
      const curr: MapBounds = {
        north: Number(b.getNorth().toFixed(7)),
        south: Number(b.getSouth().toFixed(7)),
        east: Number(b.getEast().toFixed(7)),
        west: Number(b.getWest().toFixed(7)),
      };

      if (
        last.current &&
        closeEnough(curr.north, last.current.north) &&
        closeEnough(curr.south, last.current.south) &&
        closeEnough(curr.east, last.current.east) &&
        closeEnough(curr.west, last.current.west)
      ) {
        return;
      }

      last.current = curr;
      onBoundsChanged(curr);
    };

    map.on("moveend", handle);
    handle();

    return () => {
      map.off("moveend", handle);
    };
  }, [map, onBoundsChanged]);

  return null;
}
