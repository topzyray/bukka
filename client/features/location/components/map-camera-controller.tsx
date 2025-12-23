import { useMap } from "react-leaflet";
import { forwardRef, useImperativeHandle } from "react";

export type MapCameraRef = {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
};

export const MapCameraController = forwardRef<MapCameraRef>((_, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom) {
      map.flyTo([lat, lng], zoom ?? map.getZoom(), {
        animate: true,
        duration: 0.6,
      });
    },
  }));

  return null;
});

MapCameraController.displayName = "MapCameraController";
