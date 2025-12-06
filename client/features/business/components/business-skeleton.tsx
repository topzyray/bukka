"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function BusinessSkeleton() {
  return (
    <div className="animate-in fade-in-0 duration-300">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Cover Image Skeleton */}
        <div className="relative w-full md:w-1/2 h-72 rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-full rounded-2xl" />
          <Skeleton className="absolute top-3 right-3 w-20 h-6 rounded-full" />
        </div>

        {/* Info Section Skeleton */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-2/3" /> {/* Business name */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section Skeleton */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex gap-2">
          <TabsTrigger value="overview">
            <Skeleton className="h-6 w-20" />
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Skeleton className="h-6 w-20" />
          </TabsTrigger>
          <TabsTrigger value="menu">
            <Skeleton className="h-6 w-28" />
          </TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-48 w-full mt-4 rounded-2xl" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
