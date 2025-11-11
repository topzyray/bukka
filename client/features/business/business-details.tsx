"use client";

import React, { JSX } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { ErrorBox } from "@/components/ui/error-box";
import { BusinessReviews } from "./components/business-reviews";
import { BusinessSkeleton } from "./components/business-skeleton";
import { FileCategoryEnum } from "@/data/enums";
import { File } from "@/data/interfaces/File";
import { useBusinessById } from "@/data/queries/use-businesses-query";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { Business } from "@/data/interfaces/Business";
import { BusinessPhotoGallery } from "./components/business-photo-gallery";
import { BusinessContactLocation } from "./components/business-contact-location";
import { BusinessLazyMap } from "./components/business-lazy-map";
import { BusinessOpeningHour } from "./components/business-opening-hour";
import { BusinessSocialLinks } from "./components/business-social-links";
import { BusinessInfoCard } from "./components/business-info-card";
import { BusinessMenuAndServices } from "./components/business-menu-and-service";
import { BusinessHero } from "./components/business-hero";

export function BusinessDetails(): JSX.Element {
  const { id } = useParams() as { id?: string };

  const { data, isLoading, isError } = useBusinessById({
    businessId: Number(id),
  });

  const business = data?.responseData as Business;

  const { data: businessFilesApiData, isLoading: isLoadingFiles } =
    useBusinessFiles({
      businessId: Number(id),
    });
  const businessFiles = businessFilesApiData?.responseData;

  const coverImage: File | null | undefined =
    !isLoadingFiles && businessFiles && businessFiles.length
      ? businessFiles?.find(
          (file: File) => file.category === FileCategoryEnum.BUSINESS_COVER
        ) ?? null
      : null;

  const businessImages: File[] =
    !isLoadingFiles && businessFiles?.length
      ? businessFiles?.filter(
          (file: File) => file.category === FileCategoryEnum.BUSINESS_IMAGES
        )
      : [];

  if (isLoading) return <BusinessSkeleton />;
  if (isError || !business)
    return <ErrorBox message="Unable to load business details." />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 lg:py-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          <BusinessHero
            business={business}
            coverImage={coverImage}
            isLoadingFiles={isLoadingFiles}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BusinessInfoCard business={business} />
              <BusinessPhotoGallery
                business={business}
                businessImages={businessImages}
              />
              <BusinessMenuAndServices />
              <BusinessReviews business={business} />
            </div>

            <div className="space-y-6">
              <BusinessContactLocation business={business} />

              {business.location?.latitude && business.location?.longitude && (
                <BusinessLazyMap business={business} />
              )}

              <BusinessOpeningHour business={business} />

              {business.socialLinks && (
                <BusinessSocialLinks business={business} />
              )}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
