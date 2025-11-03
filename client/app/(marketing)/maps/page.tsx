"use client";

import React from "react";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { Header } from "@/components/layouts/header";
import { MapSelector } from "@/features/location/map-selector";

export default function MapPage() {
  return (
    <div className="h-screen">
      <Header />
      <MapSelector
        onSelect={() => console.log("")}
        height={"93%"}
        showLegend={true}
        syncQuery={true}
        provider={MapProviderEnum.LOCATIONIQ}
      />
    </div>
  );
}
