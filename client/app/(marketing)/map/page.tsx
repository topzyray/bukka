"use client";

import React from "react";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { Header } from "@/components/layouts/header";
import { MapSelector } from "@/features/location/map-selector";

const Map = () => {
  return (
    <div className="h-screen">
      <Header />
      <MapSelector
        onSelect={() => console.log("")}
        height={"93%"}
        showLegend={true}
        provider={MapProviderEnum.LOCATIONIQ}
      />
    </div>
  );
};

export default Map;
