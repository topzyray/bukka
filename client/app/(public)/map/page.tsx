"use client";

import React from "react";
import { MapSelector } from "@/components/location/map-selector";
import { MapProviderEnum } from "@/server/enums/MapProviderEnum";
import { Header } from "@/components/layouts/Header";

const Map = () => {
  return (
    <div className="h-screen">
      <Header />
      <MapSelector
        onSelect={() => console.log("")}
        height={"93%"}
        provider={MapProviderEnum.LOCATIONIQ}
      />
    </div>
  );
};

export default Map;
