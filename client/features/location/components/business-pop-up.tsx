"use client";

import { useAuth } from "@/providers";
import { Badge, Star, View } from "lucide-react";
import { RouteHelper, TextHelper } from "@/helpers";
import { Business } from "@/data/interfaces/Business";
import { usePathname, useRouter } from "next/navigation";
import { BukkaButton, Separator } from "@/components/ui";
import { FavoriteButton } from "@/features/business/components/favorite-button";

export function BusinessPopUp({ business }: { business: Business }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  let businessDetailsLink: string = RouteHelper.businessDetailsLink(
    pathname,
    user?.role as string,
    business?.id
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-4">
        <div className="font-semibold text-base">{business?.name}</div>
        <Badge className="capitalize">
          {TextHelper.normalizeText(business?.type)}
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        {business?.category && (
          <div className="text-xs text-muted-foreground">
            {business?.category?.name}
          </div>
        )}
        {business?.location?.address && (
          <div className="text-xs text-muted-foreground">
            {business?.location?.address}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">
            {business?.averageRating?.toFixed(1) ?? "0.0"}
          </span>
        </div>
        <span className="opacity-80">
          ({business?.reviewCount ?? "0"} reviews)
        </span>
      </div>
      <Separator />

      <div className="flex gap-2">
        <BukkaButton
          variant="glow"
          size="sm"
          className="text-xs"
          onClick={() => {
            try {
              router.push(businessDetailsLink);
            } catch {
              window.location.href = businessDetailsLink;
            }
          }}
          title={`More Details about ${business?.name}`}
        >
          <View />
          View Details
        </BukkaButton>

        <FavoriteButton
          variant="float"
          size="sm"
          useIcon={false}
          businessId={business?.id}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
