"use client";

import { useRouter } from "next/navigation";
import { BukkaButton } from "@/components/ui";
import { Plus, Info } from "lucide-react";
import { useAuth } from "@/providers";
import { toast } from "sonner";

export function PinBusinessPopUp({ lat, lng }: { lat: number; lng: number }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  //   const goToRecommendation = () => {
  //     if (!user && !isAuthenticated) {
  //       toast("Sign in required", {
  //         description: "You need to sign in to recommend a business",
  //       });
  //     } else {
  //       router.push(`/businesses/recommend?lat=${lat}&lng=${lng}`);
  //     }
  //   };

  return (
    <div className="text-sm space-y-3">
      <div>
        <h3 className="font-semibold text-base">What would you like to do?</h3>
        <p className="text-muted-foreground text-xs">
          Choose an action for this location on the map.
        </p>
      </div>

      <div className="space-y-2">
        {/* <BukkaButton
          variant="secondary"
          className="w-full justify-start"
          onClick={goToRecommendation}
        >
          <Plus className="h-4 w-4 mr-2" />
          Recommend a Business Here
        </BukkaButton> */}

        {/* <BukkaButton
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push(`/nearby?lat=${lat}&lng=${lng}`)}
        >
          <MapPin className="h-4 w-4 mr-2" />
          View Nearby Businesses
        </BukkaButton> */}

        {/* Future actions (placeholders, safe & scalable) */}

        <BukkaButton variant="ghost" className="w-full justify-start" disabled>
          <Info className="h-4 w-4 mr-2" />
          Suggest an Edit (Coming Soon)
        </BukkaButton>
      </div>
    </div>
  );
}
