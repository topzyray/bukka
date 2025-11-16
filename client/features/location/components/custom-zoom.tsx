import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export function CustomZoomControl() {
  const map = useMap();

  useEffect(() => {
    const ctrl = L.control.zoom({ position: "topleft" }).addTo(map);

    const container = ctrl.getContainer();
    if (container) {
      // style the control itself
      Object.assign(container.style, {
        zIndex: "1000",
        position: "relative", // ensure it's placed within its stacking context
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      });

      // style parent containers to avoid parent stacking issues
      const parent = container.parentElement; // typically .leaflet-top.leaflet-left
      if (parent) {
        (parent as HTMLElement).style.zIndex = "1000";
        (parent as HTMLElement).style.position = "relative";
      }

      // and the main control container
      const controlContainer = map
        .getContainer()
        .querySelector(".leaflet-control-container") as HTMLElement | null;
      if (controlContainer) {
        controlContainer.style.zIndex = "1000";
        controlContainer.style.position = "relative";
      }

      // if map wrapper (the element you render MapContainer inside) has transforms/filters,
      // you might need to raise it too:
      const mapRoot = map.getContainer();
      if (mapRoot) {
        (mapRoot as HTMLElement).style.zIndex = "0"; // ensure it isn't artificially above overlays
        // If a parent wrapper has transform/backdrop-filter, that wrapper may create a stacking context.
        // You can detect it in
      }
    }

    return () => {
      ctrl.remove();
    };
  }, [map]);

  return null;
}
