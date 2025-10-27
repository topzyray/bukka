"use client";

import React from "react";
import { MapProviderEnum } from "@/server/enums/MapProviderEnum";
import { Header } from "@/components/layouts/Header";
import { MapSelector } from "@/components/views/location/map-selector";

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
