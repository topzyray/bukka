"use client";

import React from "react";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { Header } from "@/components/layouts/header";
import { MapSelector } from "@/features/location/map-selector";
import { useIsMobile } from "@/hooks";

export default function MapPage() {
  const isMobile = useIsMobile();
  return (
    <div className="h-screen">
      <Header />
      <MapSelector
        onSelect={() => console.log("")}
        height={isMobile ? "90%" : "93%"}
        showLegend={true}
        syncQuery={true}
        provider={MapProviderEnum.LOCATIONIQ}
      />
    </div>
  );
}
