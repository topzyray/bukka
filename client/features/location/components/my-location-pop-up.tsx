"use client";

import { useRouter } from "next/navigation";
import { BukkaButton } from "@/components/ui";
import { Locate, MapPin, Plus } from "lucide-react";

export function MyLocationPopUp({ lat, lng }: { lat: number; lng: number }) {
  const router = useRouter();

  return (
    <div className="text-sm space-y-3 w-56">
      <div>
        <h3 className="font-semibold text-base">You’re Here</h3>
        <p className="text-muted-foreground text-xs">
          Quick actions based on your current location.
        </p>
      </div>

      <div className="space-y-2">
        <BukkaButton
          variant="secondary"
          className="w-full justify-start"
          onClick={() => router.push(`/nearby?lat=${lat}&lng=${lng}`)}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Find Food Near Me
        </BukkaButton>

        <BukkaButton
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push(`/recommend?lat=${lat}&lng=${lng}`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Recommend a Business Around Me
        </BukkaButton>

        <BukkaButton
          variant="ghost"
          className="w-full justify-start"
          onClick={() => router.push(`/map?center=me`)}
        >
          <Locate className="h-4 w-4 mr-2" />
          Re-center Map
        </BukkaButton>
      </div>
    </div>
  );
}
