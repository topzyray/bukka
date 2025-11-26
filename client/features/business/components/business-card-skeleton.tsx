"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BusinessCardSkeleton() {
  return (
    <div className="cursor-pointer h-full shadow-lg">
      <div className="overflow-hidden rounded-lg shadow-card h-full">
        {/* Image placeholder */}
        <div className="relative w-full aspect-[16/9]">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="p-4 space-y-4">
          {/* Title + Badge */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Rating + Distance */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>

          {/* Cuisines */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
          </div>

          {/* Bottom buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
