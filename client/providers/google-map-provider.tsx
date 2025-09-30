"use client";

import { CircularLoader } from "@/components/loaders/circular-loader";
import { useLoadScript } from "@react-google-maps/api";

const libraries: "places"[] = ["places"];

export default function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });

  if (!isLoaded) {
    return <CircularLoader />;
  }

  return children;
}
