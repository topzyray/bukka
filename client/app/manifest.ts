import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bukka",
    short_name: "Bukka",
    description:
      "Discover and explore restaurants, bars, lounges, bakeries, and catering services near you with Bukka. Search by location, category, or ratings.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen"],
    orientation: "portrait",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
