import { useMap } from "react-leaflet";
import { forwardRef, useImperativeHandle } from "react";

export type MapCameraRef = {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
};

export const MapCameraController = forwardRef<MapCameraRef>((_, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom = map.getZoom()) {
      map.flyTo([lat, lng], zoom, {
        animate: true,
        duration: 0.6,
      });
    },
  }));

  return null;
});

// export type MapCameraRef = {
//   flyTo: (lat: number, lng: number, zoom?: number) => void;
//   fitBounds: (bounds: L.LatLngBounds, options?: L.FitBoundsOptions) => void;
// };

// export const MapCameraController = forwardRef<MapCameraRef>((_, ref) => {
//   const map = useMap();

//   useImperativeHandle(ref, () => ({
//     flyTo(lat, lng, zoom) {
//       map.flyTo([lat, lng], zoom ?? map.getZoom(), {
//         animate: true,
//         duration: 0.6,
//       });
//     },
//     fitBounds(bounds, options) {
//       map.fitBounds(bounds, {
//         padding: [80, 80],
//         animate: true,
//         ...options,
//       });
//     },
//   }));

//   return null;
// });

MapCameraController.displayName = "MapCameraController";
