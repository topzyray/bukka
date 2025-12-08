import { Business } from "@/data/interfaces/Business";
import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import { BusinessPopUp } from "./business-pop-up";

export const BusinessMarker = memo(
  ({
    business,
    icon,
    onClick,
  }: {
    business: Business;
    icon: L.Icon;
    onClick?: () => void;
  }) => {
    const lat = business?.location?.latitude;
    const lng = business?.location?.longitude;
    if (lat == null || lng == null) return null;

    return (
      <Marker
        key={business.id}
        position={[lat, lng]}
        icon={icon}
        eventHandlers={{
          click: onClick,
        }}
      >
        <Popup>
          <BusinessPopUp business={business} />
        </Popup>
      </Marker>
    );
  }
);
