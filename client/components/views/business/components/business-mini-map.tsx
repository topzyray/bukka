"use client";

import { MapProviderEnum } from "@/server/enums/MapProviderEnum";
import { Business } from "@/server/interfaces/Business";
import dynamic from "next/dynamic";
import React from "react";

const MapSelector = dynamic(
  () =>
    import("@/components/views/location/map-selector").then(
      (mod) => mod.MapSelector
    ),
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
