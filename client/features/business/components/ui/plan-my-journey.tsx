import React, { useState } from "react";
import { BukkaButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Goal } from "lucide-react";
import { useUserLocation } from "@/providers";
import { Business } from "@/data/interfaces/Business";
import { toast } from "sonner";

interface IPlanMyJourneyButton {
  business: Business;
}

export const PlanMyJourneyButton = ({ business }: IPlanMyJourneyButton) => {
  const [loadingDirections, setLoadingDirections] = useState(false);
  const {
    userCoordinates,
    loading: loadingUserLocation,
    error: userCoordingError,
    refreshUserLocation,
  } = useUserLocation();

  // const handlePlanJourney = () => {
  //   if (!navigator.geolocation) {
  //     alert("Geolocation is not supported by your browser.");
  //     return;
  //   }

  //   setLoadingDirections(true);

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log("position : ", position);
  //       const origin = `${position.coords.latitude},${position.coords.longitude}`;
  //       const destination = encodeURIComponent(details?.address ?? "");
  //       const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  //       window.open(mapsUrl, "_blank");
  //       setLoadingDirections(false);
  //     },
  //     (error) => {
  //       setLoadingDirections(false);

  //       switch (error.code) {
  //         case error.PERMISSION_DENIED:
  //           alert(
  //             "Location permission denied. Please enable location access in your browser."
  //           );
  //           break;
  //         case error.POSITION_UNAVAILABLE:
  //           alert(
  //             "Your location is currently unavailable. Please try again or enter it manually."
  //           );
  //           break;
  //         case error.TIMEOUT:
  //           alert("Location request timed out. Please try again.");
  //           break;
  //         default:
  //           alert("Unable to retrieve your location. Please try again later.");
  //       }
  //     },
  //     {
  //       timeout: 10000,
  //       maximumAge: 0,
  //       enableHighAccuracy: true,
  //     }
  //   );
  // };
  const handlePlanJourney = () => {
    setLoadingDirections(true);

    if (loadingUserLocation) {
      toast.info("Fetching your location...");
      return;
    }

    if (userCoordingError) {
      toast.error("Failed to fetch location", {
        description: userCoordingError,
      });
      return;
    }

    if (!userCoordinates) {
      console.log("USER COORDINATE: ", userCoordinates);

      refreshUserLocation();
      return;
    }

    const origin = `${userCoordinates?.lat},${userCoordinates?.lng}`;
    const destination = `${business?.location?.latitude},${business?.location?.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(mapsUrl, "_blank");
    setLoadingDirections(false);
  };

  return (
    <BukkaButton
      size="sm"
      variant="glow"
      onClick={handlePlanJourney}
      className={cn(
        "flex-1",
        `cursor-${loadingDirections ? "not-allowed" : "pointer"}`,
        loadingDirections ? "opacity-60" : "opacity-100"
      )}
      disabled={loadingDirections}
    >
      <Goal />
      <span>{loadingDirections ? "Locating..." : "Visit Location"}</span>
    </BukkaButton>
  );
};
