import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface IAutoFitMarkers {
  markerPositions: { lat: number; lng: number }[];
  maxZoom?: number; // prevent over-zooming
}

export function AutoFitMarkers({
  markerPositions,
  maxZoom = 15,
}: IAutoFitMarkers) {
  const map = useMap();

  useEffect(() => {
    if (markerPositions.length === 0) return;

    const bounds = L.latLngBounds(markerPositions.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom, animate: true });
  }, [markerPositions, map, maxZoom]);

  return null;
}
