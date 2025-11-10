"use client";

import React, { useState, memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Phone, ExternalLink, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BukkaButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Business } from "@/data/interfaces/Business";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { FileCategoryEnum } from "@/data/enums";
import { File } from "@/data/interfaces/File";
import { useDistance } from "@/hooks/use-distance";
import { FavoriteButton } from "./favorite-button";
import { BusinessHelper } from "../helper/bussiness-helper";
import { PlanMyJourneyButton } from "./ui/plan-my-journey";
import { useAuth } from "@/providers";

interface IBusinessCard {
  business: Business;
  variant?: "default" | "compact" | "featured";
  className?: string;
  inDashboard?: boolean;
  onClick?: () => void;
}

export const BusinessCard = memo(function BusinessCard({
  business,
  variant = "default",
  inDashboard = false,
  className,
  onClick,
}: IBusinessCard) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

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

  const renderRating = () =>
    business?.rating ? (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-accent text-accent" />
        <span className="text-sm font-medium">
          {business?.rating.toFixed(1)}
        </span>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-accent text-accent" />
        <span className="text-sm font-medium">
          {business?.rating.toFixed(1)}
        </span>
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

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn("cursor-pointer h-full", className)}
        onClick={onClick}
      >
        <Card className="overflow-hidden shadow-card hover:shadow-elegant h-full transition-smooth py-0">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              {!imageError && coverImage ? (
                <Image
                  src={coverImage?.fullPath}
                  alt={business?.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                  priority={!!coverImage?.fullPath}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full warm-gradient flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {business?.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate hover:text-foreground">
                {business?.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {business?.location?.address ?? business?.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {renderRating()}
                {renderDistance()}
              </div>
            </div>

            <FavoriteButton
              businessId={business?.id}
              className="flex-shrink-0 w-8 h-8"
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn("cursor-pointer h-full", className)}
      onClick={onClick}
    >
      <Card className="py-0 overflow-hidden shadow-card hover:shadow-elegant h-full transition-smooth group gap-0">
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
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg truncate group-hover:text-foreground transition-colors">
                {business?.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {business?.location?.address ?? business?.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
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

              <BukkaButton
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
                onClick={() => {
                  window.location.href =
                    business?.location && !inDashboard
                      ? `/maps?q=${business?.location?.latitude},${business?.location?.longitude}`
                      : business?.location && inDashboard
                      ? `/dashboard/${user?.role?.toLowerCase()}/maps?q=${
                          business?.location?.latitude
                        },${business?.location?.longitude}`
                      : "#";
                }}
              >
                <MapPin className="w-3 h-3 mr-1" />
                View on Map
              </BukkaButton>

              <PlanMyJourneyButton business={business} />
              {business?.website && (
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
              )}
              <BukkaButton
                variant="warm"
                size="sm"
                className="flex-1"
                type="button"
                onClick={() => router.push(`/businesses/${business?.id}`)}
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

BusinessCard.displayName = "BusinessCard";
