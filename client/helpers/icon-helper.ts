// import L from "leaflet";

export class IconHelper {
  /**
   * Create a color-aware Leaflet icon.
   *
   * @param path Relative path to your SVG (e.g. "/icons/flat/you.svg")
   * @param className Tailwind or custom class that controls text color (e.g. "text-blue-500")
   * @param size [width, height] defaults to [38, 50]
   */
  // static createColoredIcon(
  //   path: string,
  //   className: string = "text-primary",
  //   size: [number, number] = [38, 50]
  // ): L.Icon {
  //   return L.icon({
  //     iconUrl: path,
  //     iconSize: size,
  //     iconAnchor: [size[0] / 2, size[1]],
  //     className: `leaflet-colored-icon ${className}`,
  //   });
  // }

  // static async createColoredIcon(
  //   path: string,
  //   className = "text-primary",
  //   size: [number, number] = [38, 50]
  // ): Promise<any> {
  //   if (typeof window === "undefined") return null; // server stub

  //   const L = (await import("leaflet")).default;

  //   return L.icon({
  //     iconUrl: path,
  //     iconSize: size,
  //     iconAnchor: [size[0] / 2, size[1]],
  //     className: `leaflet-colored-icon ${className}`,
  //   });
  // }

  static createColoredIcon(
    path: string,
    className: string = "text-primary",
    size: [number, number] = [38, 50]
  ): any | null {
    // Prevent SSR errors
    if (typeof window === "undefined") {
      return null;
    }

    // Lazy-load Leaflet only in the browser
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");

    return L.icon({
      iconUrl: path,
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1]],
      className: `leaflet-colored-icon ${className}`,
    });
  }
}
