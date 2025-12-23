import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handler = () => onZoom(map.getZoom());
    map.on("zoomend", handler);

    return () => {
      map.off("zoomend", handler);
    };
  }, [map, onZoom]);

  return null;
}
