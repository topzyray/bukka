// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { useUserLocation } from "@/providers";
// import { Loader2 } from "lucide-react";
// import { useState } from "react";
// import { useMap } from "react-leaflet";
// import { toast } from "sonner";

// export function RecenterButton({
//   onLocate,
// }: {
//   onLocate?: (coords: { lat: number; lng: number }) => void;
// }) {
//   const map = useMap();
//   // const { setCoordinates } = useGlobalState();
//   const {
//     userCoordinates,
//     setUserCoordinates,
//     loading: loadingUserLocation,
//     error: userLocationError,
//     refreshUserLocation,
//   } = useUserLocation();

//   const [locating, setLocating] = useState(false);

//   const handleLocate = () => {
//     setLocating(true);
//     if (loadingUserLocation) {
//       toast.info("Fetching your location...");
//       return;
//     }

//     if (userLocationError) {
//       toast.error("Failed to fetch location", {
//         description: userLocationError,
//       });
//       return;
//     }

//     if (!userCoordinates) {
//       refreshUserLocation();
//       return;
//     }

//     map.flyTo([userCoordinates.lat, userCoordinates.lng], 16, {
//       animate: true,
//     });
//     onLocate?.(userCoordinates);
//     // setCoordinates(userCoordinates);
//     toast.success("Centered on your location");

//     setLocating(false);
//   };

//   return (
//     <div className="absolute top-2.5 right-2.5 z-499">
//       <Button
//         type="button"
//         variant="ghost"
//         size="icon"
//         onClick={handleLocate}
//         onContextMenu={(e) => {
//           e.preventDefault();
//           setUserCoordinates(null);
//           toast("Next click will fetch your live location again");
//         }}
//         className="relative hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full"
//         title="Go to my location"
//       >
//         <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse-ring" />

//         {locating ? (
//           <Loader2 className="animate-spin" />
//         ) : (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 32 32"
//             fill="currentColor"
//             className={cn(
//               "w-10 h-10 text-primary drop-shadow-sm",
//               "animate-spin-slow text-blue-500"
//             )}
//           >
//             <circle
//               cx="16"
//               cy="16"
//               r="14"
//               stroke="currentColor"
//               strokeWidth="2"
//               fill="none"
//             />
//             <path
//               d="M10.5 21.5a1 1 0 0 0 1.1.23l7-2.8a1 1 0 0 0 .55-.55l2.8-7a1 1 0 0 0-1.33-1.33l-7 2.8a1 1 0 0 0-.55.55l-2.8 7a1 1 0 0 0 .23 1.1Z"
//               fill="currentColor"
//             />
//           </svg>
//         )}
//       </Button>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserLocation } from "@/providers";
import { Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { toast } from "sonner";

export function RecenterButton({
  onLocate,
  targetZoom = 16,
}: {
  onLocate?: (coords: { lat: number; lng: number }) => void;
  targetZoom?: number;
}) {
  const map = useMap();
  const {
    userCoordinates,
    setUserCoordinates,
    loading,
    error,
    refreshUserLocation,
  } = useUserLocation();

  const [locating, setLocating] = useState(false);

  const handleLocate = useCallback(() => {
    if (loading) {
      toast.info("Fetching your location…");
      return;
    }

    if (error) {
      toast.error("Failed to fetch location", { description: error });
      return;
    }

    if (!userCoordinates) {
      refreshUserLocation();
      return;
    }

    setLocating(true);

    map.flyTo([userCoordinates.lat, userCoordinates.lng], targetZoom, {
      animate: true,
    });

    onLocate?.(userCoordinates);
    toast.success("Centered on your location");

    setTimeout(() => setLocating(false), 400);
  }, [
    loading,
    error,
    userCoordinates,
    refreshUserLocation,
    map,
    targetZoom,
    onLocate,
  ]);

  return (
    <div className="absolute top-2.5 right-2.5 z-500">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleLocate}
        onContextMenu={(e) => {
          e.preventDefault();
          setUserCoordinates(null);
          toast("Next click will fetch your live location again");
        }}
        className="relative rounded-full"
        title="Go to my location"
      >
        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse-ring" />

        {locating ? (
          <Loader2 className="animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className={cn("w-10 h-10 text-blue-500 drop-shadow-sm")}
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M10.5 21.5a1 1 0 0 0 1.1.23l7-2.8a1 1 0 0 0 .55-.55l2.8-7a1 1 0 0 0-1.33-1.33l-7 2.8a1 1 0 0 0-.55.55l-2.8 7a1 1 0 0 0 .23 1.1Z"
              fill="currentColor"
            />
          </svg>
        )}
      </Button>
    </div>
  );
}
