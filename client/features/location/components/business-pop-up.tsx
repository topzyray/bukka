"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers";
import { useDistance } from "@/hooks";
import { motion } from "framer-motion";
import { File } from "@/data/interfaces/File";
import { FileCategoryEnum } from "@/data/enums";
import { memo, useMemo, useState } from "react";
import { RouteHelper, TextHelper } from "@/helpers";
import { Business } from "@/data/interfaces/Business";
import { usePathname, useRouter } from "next/navigation";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { Badge, BukkaButton, Card, CardContent } from "@/components/ui";
import { PlanMyJourneyButton } from "@/features/business/ui/plan-my-journey";
import { BusinessHelper } from "@/features/business/helper/bussiness-helper";
import { Clock, ExternalLink, Info, MapPin, Phone, Star } from "lucide-react";
import { FavoriteButton } from "@/features/business/components/favorite-button";

interface IBusinessCard {
  business: Business;
  variant?: "default" | "compact" | "featured";
  className?: string;
  inDashboard?: boolean;
  onClick?: () => void;
}

export const BusinessPopUp = memo(function BusinessCard({
  business,
  className,
  onClick,
}: IBusinessCard) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();
  const { data: businessFilesApiData, isLoading: isLoadingFiles } =
    useBusinessFiles({
      businessId: Number(business?.id),
    });
  const businessFiles = businessFilesApiData?.responseData;

  const coverImage: File | null | undefined =
    !isLoadingFiles && businessFiles && businessFiles.length
      ? businessFiles?.find(
          (file: File) => file.category === FileCategoryEnum.BUSINESS_COVER
        ) ?? null
      : null;

  const { formatted } = useDistance({
    targetLat: business?.location?.latitude,
    targetLng: business?.location?.longitude,
  });

  const openNow = useMemo(
    () => BusinessHelper.isOpenNow(business?.openingHours),
    [business?.openingHours]
  );

  let businessDetailsLink: string = RouteHelper.businessDetailsLink(
    pathname,
    user?.role as string,
    business?.id
  );

  const renderRating = () =>
    business?.averageRating || business?.reviewCount ? (
      <div className="flex items-center flex-wrap gap-1 text-sm font-medium">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span>{business?.averageRating?.toFixed(1)}</span>
        </div>
        <span>({business?.reviewCount ?? "0"} reviews)</span>
      </div>
    ) : (
      <div className="flex items-center flex-wrap gap-1 text-sm font-medium">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span>{business?.averageRating?.toFixed(1) ?? "0.0"}</span>
        </div>
        <span>({business?.reviewCount ?? "0"} reviews)</span>
      </div>
    );

  const renderDistance = () => {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="w-6 h-6" />
        <span className="text-xs">{formatted}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn("cursor-pointer w-full", className)}
      onClick={onClick}
    >
      <Card className="p-0 overflow-hidden shadow-card hover:shadow-elegant h-full transition-smooth group gap-0">
        <div className="relative overflow-hidden">
          <div className="relative overflow-hidden w-full aspect-[16/9]">
            {!imageError && coverImage ? (
              <Image
                src={coverImage?.fullPath}
                alt={business?.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full warm-gradient flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {business?.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <FavoriteButton
            businessId={business?.id}
            className="absolute top-3 right-3 w-8 h-8"
          />

          {openNow !== undefined && (
            <Badge
              variant={openNow ? "default" : "secondary"}
              className="absolute bottom-3 left-3"
            >
              <Clock className="w-3 h-3 mr-1" />
              {openNow ? "Open" : "Closed"}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-lg truncate group-hover:text-foreground transition-colors">
                {business?.name}{" "}
                <Badge className="uppercase">
                  {TextHelper.normalizeText(business?.type)}
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {business?.location?.address ?? business?.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {renderRating()}
              </div>
              <div className="flex-1">{renderDistance()}</div>
            </div>

            {business?.cuisines && business?.cuisines.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {business?.cuisines
                  .slice(0, 3)
                  .map((c: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {typeof c === "string" ? c : String(c)}
                    </Badge>
                  ))}
              </div>
            ) : (
              <Badge variant="outline">No cuisines added yet</Badge>
            )}

            <div className="flex gap-2 pt-2 justify-end flex-wrap">
              {business?.phoneNumber && (
                <Link href={`tel:${business?.phoneNumber}`}>
                  <BukkaButton
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </BukkaButton>
                </Link>
              )}

              <PlanMyJourneyButton business={business} />

              {/* {business?.website && (
                <Link
                  href={
                    business?.website.startsWith("http")
                      ? business?.website
                      : `https://${business?.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <BukkaButton
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Website
                  </BukkaButton>
                </Link>
              )} */}

              <BukkaButton
                variant="warm"
                size="sm"
                className="flex-1"
                type="button"
                onClick={() => {
                  router.push(businessDetailsLink);
                }}
                asChild
              >
                <Info className="w-3 h-3 mr-1" />
                Details
              </BukkaButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

BusinessPopUp.displayName = "BusinessPopUp";

// export function BusinessPopUp({ business }: { business: Business }) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   let businessDetailsLink: string = RouteHelper.businessDetailsLink(
//     pathname,
//     user?.role as string,
//     business?.id
//   );

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex justify-between gap-4">
//         <div className="font-semibold text-base">{business?.name}</div>
//         <Badge className="capitalize">
//           {TextHelper.normalizeText(business?.type)}
//         </Badge>
//       </div>
//       <div className="flex flex-col gap-1">
//         {business?.category && (
//           <div className="text-xs text-muted-foreground">
//             {business?.category?.name}
//           </div>
//         )}
//         {business?.location?.address && (
//           <div className="text-xs text-muted-foreground">
//             {business?.location?.address}
//           </div>
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         <div className="flex items-center gap-1">
//           <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//           <span className="font-semibold">
//             {business?.averageRating?.toFixed(1) ?? "0.0"}
//           </span>
//         </div>
//         <span className="opacity-80">
//           ({business?.reviewCount ?? "0"} reviews)
//         </span>
//       </div>
//       <Separator />

//       <div className="flex gap-2">
//         <BukkaButton
//           variant="glow"
//           size="sm"
//           className="text-xs"
//           onClick={() => {
//             try {
//               router.push(businessDetailsLink);
//             } catch {
//               window.location.href = businessDetailsLink;
//             }
//           }}
//           title={`More Details about ${business?.name}`}
//         >
//           <View />
//           View Details
//         </BukkaButton>

//         <FavoriteButton
//           variant="float"
//           size="sm"
//           useIcon={false}
//           businessId={business?.id}
//           className="rounded-lg"
//         />
//       </div>
//     </div>
//   );
// }
