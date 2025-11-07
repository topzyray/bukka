"use client";

import { useRouter } from "next/navigation";
import { BukkaButton } from "@/components/ui";
import { MapSelector } from "@/features/location/map-selector";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";

export default function DashboardMapsPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-[calc(100svh-3.75rem)] overflow-hidden bg-card">
      <div className="fixed inset-0 top-[3.75rem] w-full h-[calc(100svh-3.75rem)] z-0 overflow-hidden">
        <MapSelector
          onSelect={() => console.log("")}
          height="100%"
          showLegend
          syncQuery
          provider={MapProviderEnum.LOCATIONIQ}
        />
      </div>

      <div className="fixed bottom-0 md:bottom-2 left-0 right-0 z-50 flex md:justify-center overflow-hidden">
        <div className="bg-transparent backdrop-blur rounded-lg shadow-md p-2 flex flex-col md:flex-row gap-3">
          <BukkaButton onClick={() => router.push("overview")}>
            Dashboard
          </BukkaButton>
          <BukkaButton onClick={() => router.push(`favourites`)}>
            Favourites
          </BukkaButton>
          <BukkaButton onClick={() => router.push(`orders`)}>
            My Orders
          </BukkaButton>
          <BukkaButton onClick={() => router.replace(`maps`)}>
            Reset
          </BukkaButton>
        </div>
      </div>
    </div>
  );
}
