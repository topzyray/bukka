"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton({ height = 360 }: { height?: number | string }) {
  return (
    <div
      style={{ height }}
      className="relative w-full rounded-md overflow-hidden"
    >
      {/* Map background */}
      <Skeleton className="h-full w-full rounded-md" />

      {/* Search bar placeholder */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[14rem] sm:w-[18rem]">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Zoom controls */}
      <div className="absolute right-2 top-2 flex flex-col gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* Optional legend */}
      <div className="absolute bottom-4 right-2 space-y-2">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
    </div>
  );
}
