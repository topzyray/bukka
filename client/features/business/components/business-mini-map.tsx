"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { Business } from "@/data/interfaces/Business";

const MapSelector = dynamic(
  () =>
    import("@/features/location/map-selector").then((mod) => mod.MapSelector),
  { ssr: false }
);

interface IBusinessMiniMap {
  business: Business;
}

export const BusinessMiniMap: React.FC<IBusinessMiniMap> = ({ business }) => {
  const onSelect = () => {};
  return (
    <div className="rounded-2xl overflow-hidden border shadow-sm">
      <MapSelector
        initial={{
          lat: business?.location?.latitude,
          lng: business?.location?.longitude,
        }}
        showSearchPlaces={false}
        height="300px"
        zoom={15}
        provider={MapProviderEnum.LOCATIONIQ}
        onSelect={onSelect}
        // showControls={false}
        // showUserLocation={false}
        // disabled={true}
      />
    </div>
  );
};
