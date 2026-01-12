"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MenuManager } from "../vendor/components/menu-manager";
import { ServiceManager } from "../vendor/components/service-manager";
import { useBusinessById } from "@/data/queries/use-businesses-query";
import { ErrorBox, BukkaButton } from "@/components/ui";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { CreateUpdateBusinessModal } from "../vendor/modals/create-update-business-modal";
import { queryClient } from "@/lib";
import { Business } from "@/data/interfaces/Business";
import { BusinessReviews } from "@/features/business/components/business-reviews";
import { FileCategoryEnum, QueryKeyEnum, UserRoleEnum } from "@/data/enums";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { File } from "@/data/interfaces/File";
import { motion } from "framer-motion";
import { BusinessPhotoGallery } from "@/features/business/components/business-photo-gallery";
import { BusinessContactLocation } from "@/features/business/components/business-contact-location";
import { BusinessLazyMap } from "@/features/business/components/business-lazy-map";
import { BusinessOpeningHour } from "@/features/business/components/business-opening-hour";
import { BusinessSocialLinks } from "@/features/business/components/business-social-links";
import { BusinessInfoCard } from "@/features/business/components/business-info-card";
import { BusinessMenuAndServices } from "@/features/business/components/business-menu-and-service";
import { BusinessHero } from "@/features/business/components/business-hero";
import { Edit } from "lucide-react";
import { useAuth } from "@/providers";

export const BusinessDetails: React.FC = () => {
  const { id } = useParams() as unknown as { id: number };

  const { user } = useAuth();

  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Business> | undefined>(
    undefined
  );

  const { data, isLoading, isError, error } = useBusinessById({
    businessId: id,
  });
  const business = data?.responseData;

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

  const handleEdit = () => {
    setMode("edit");
    setInitialData(business);
    setIsModalOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setMode("edit");
      setInitialData(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Details</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {business?.name} management page
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === UserRoleEnum.VENDOR && (
            <>
              {business && <MenuManager business={business} />}
              {business && <ServiceManager business={business} />}
              {/* {business && <OrdersTable business={business} />} */}
            </>
          )}

          {user &&
            [UserRoleEnum.ADMIN, UserRoleEnum.VENDOR].includes(
              user?.role as UserRoleEnum
            ) && (
              <>
                <BukkaButton onClick={handleEdit}>
                  <Edit /> Edit Business
                </BukkaButton>

                <CreateUpdateBusinessModal
                  open={isModalOpen}
                  onOpenChange={handleOpenChange}
                  mode={mode}
                  initialData={mode === "edit" ? initialData : undefined}
                  onSuccess={() => {
                    queryClient.removeQueries({
                      queryKey: [QueryKeyEnum.MY_BUSINESSES],
                    });
                    setIsModalOpen(false);
                  }}
                />
              </>
            )}
        </div>
      </header>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <CircularLoader text="Loading Business Details" />
          </div>
        ) : business ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-full space-y-4">
                <Card>
                  <CardContent>
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : isError ? (
          <ErrorBox error={error} />
        ) : null}
      </div>
    </div>
  );
};
