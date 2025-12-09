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
import {
  BukkaButton,
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperFooter,
  PageWrapperHeader,
} from "@/components/ui";
import { extractErrorMessage } from "@/utils";
import { MapPin, TrendingUp } from "lucide-react";
import Link from "next/link";

export function BusinessDetails(): JSX.Element {
  const { id } = useParams() as { id?: string };

  const { data, isLoading, isError, error, refetch } = useBusinessById({
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

  return (
    <PageWrapper>
      <PageWrapperHeader>
        <Header />
      </PageWrapperHeader>
      <PageWrapperContent>
        <PageWrapperContentWithFramer className="mx-auto px-4 py-6 lg:py-10 max-w-7xl">
          {isLoading && <BusinessSkeleton />}

          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="col-span-full flex flex-col items-center justify-center text-center py-20"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-7xl md:text-8xl mb-8 opacity-60"
              >
                ⚠️
              </motion.div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
                Oops! An Error Occurred!
              </h3>

              <p className="text-muted-foreground max-w-md mx-auto mb-6 text-lg md:text-xl">
                We couldn’t load the business details right now. Please try
                again shortly.
              </p>

              {/* Optional: Show simplified error message */}
              {isError && (
                <p className="text-lg text-red-500 dark:text-red-300 max-w-md mb-8 break-words px-4">
                  Reason: {extractErrorMessage(error)}
                </p>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <BukkaButton
                  variant="warm"
                  size="lg"
                  onClick={() => refetch()}
                  className="px-6 md:px-8"
                >
                  Retry
                  <TrendingUp className="w-5 h-5 ml-2" />
                </BukkaButton>

                <Link href="/businesses">
                  <BukkaButton
                    variant="outline"
                    size="lg"
                    className="px-6 md:px-8"
                  >
                    Explore Businesses
                    <MapPin className="w-5 h-5 ml-2" />
                  </BukkaButton>
                </Link>
              </div>
            </motion.div>
          )}

          {business && (
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
                  {/* <BusinessMenuAndServices /> */}
                  <BusinessReviews business={business} />
                </div>

                <div className="space-y-6">
                  <BusinessContactLocation business={business} />

                  {business.location?.latitude &&
                    business.location?.longitude && (
                      <BusinessLazyMap business={business} />
                    )}

                  <BusinessOpeningHour business={business} />

                  {business.socialLinks && (
                    <BusinessSocialLinks business={business} />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
      <PageWrapperFooter>
        <Footer />
      </PageWrapperFooter>{" "}
    </PageWrapper>
  );
}
