"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MenuManager } from "../vendor/components/menu-manager";
import { ServiceManager } from "../vendor/components/service-manager";
import { useBusinessById } from "@/data/queries/use-businesses-query";
import {
  Badge,
  Button,
  ErrorBox,
  BukkaButton,
  Label,
  Separator,
  SmartFileUploader,
} from "@/components/ui";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { CreateUpdateBusinessModal } from "../vendor/modals/create-update-business-modal";
import { useQueryClient } from "@tanstack/react-query";
import { Business } from "@/data/interfaces/Business";
import {
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  Music2,
  Phone,
  Star,
  Twitter,
} from "lucide-react";
import { LazyMapObserver } from "@/features/business/components/lazy-map-observer";
import Link from "next/link";
import { BusinessReviews } from "@/features/business/components/business-reviews";
import { FileCategoryEnum, FileReferenceTypeEnum } from "@/data/enums";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { BusinessHelper } from "@/features/business/helper/bussiness-helper";
import { File } from "@/data/interfaces/File";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextHelper } from "@/helpers";
import { FileApiService } from "@/data/services";
import { BusinessPhotoGallery } from "@/features/business/components/business-photo-gallery";

export const BusinessDetails: React.FC = () => {
  const { id } = useParams() as unknown as { id: number };
  const queryClient = useQueryClient();

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

  const openNow = useMemo(
    () => BusinessHelper.isOpenNow(business?.openingHours),
    [business?.openingHours]
  );

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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Details</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {business?.name} management page
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BukkaButton onClick={handleEdit}>Edit</BukkaButton>
          <CreateUpdateBusinessModal
            open={isModalOpen}
            onOpenChange={handleOpenChange}
            mode={mode}
            initialData={mode === "edit" ? initialData : undefined}
            onSuccess={() => {
              queryClient.removeQueries({ queryKey: ["my-businesses"] });
              setIsModalOpen(false);
            }}
          />
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
              <div className="lg:col-span-2 space-y-4">
                {/* <Card>
                        <CardHeader>
                          <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <h2 className="text-xl font-semibold">
                            {business?.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {business?.description}
                          </p>
                        </CardContent>
                      </Card> */}

                <Card>
                  {/* <CardHeader>
                          <CardTitle>Business Details</CardTitle>
                        </CardHeader> */}
                  <CardContent>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-8"
                    >
                      {/* HERO */}
                      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                        {isLoadingFiles ? (
                          <Loader2 className="animate-spin h-32 w-32" />
                        ) : coverImage ? (
                          <Image
                            src={coverImage?.fullPath}
                            alt={business?.name}
                            fill
                            className="object-cover"
                            priority={!!coverImage?.fullPath}
                          />
                        ) : (
                          <Image
                            src={"/images/placeholder.jpg"}
                            alt={"business coverImage"}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/28" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                              {business?.name}
                            </h1>
                            <div className="flex items-center gap-3 text-white">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {business?.rating?.toFixed(1) ?? "0.0"}
                              </span>
                              <span className="opacity-80">
                                ({business?.totalReviews ?? 0} reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        <SmartFileUploader
                          title="Add Cover Image"
                          useCameraModal
                          uploadFn={FileApiService.uploadFile}
                          extraParams={{
                            referenceType: FileReferenceTypeEnum.BUSINESS,
                            category: FileCategoryEnum.BUSINESS_COVER,
                            referenceId: business?.id,
                            isPublic: true,
                            metadata: {
                              altText: `${business?.name} - coverImage image`,
                            },
                          }}
                          onUploadSuccess={() => {
                            queryClient.invalidateQueries({
                              queryKey: ["business-files", business?.id],
                            });
                          }}
                        />
                      </div>

                      {/* GRID */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Info Card */}
                          <Card>
                            <CardContent className="p-6 space-y-4">
                              <div className="flex gap-6 h-16">
                                <div className="space-y-2">
                                  <Label>Type/Category</Label>
                                  <Badge
                                    variant="outline"
                                    className="uppercase"
                                  >
                                    {TextHelper.normalizeText(business?.type)}
                                  </Badge>
                                </div>

                                <Separator orientation="vertical" />

                                <div className="space-y-2">
                                  <Label>Availability</Label>
                                  <Badge
                                    variant={
                                      openNow ? "success" : "destructive"
                                    }
                                  >
                                    {openNow ? "Open Now" : "Closed"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Cuisines</Label>
                                <div className="flex flex-wrap gap-1">
                                  {business?.cuisines?.length === 0
                                    ? "No cusines add yet!"
                                    : business.cuisines?.map((c: string) => (
                                        <Badge
                                          key={c}
                                          variant="secondary"
                                          className="capitalize"
                                        >
                                          {c}
                                        </Badge>
                                      ))}
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-2">
                                <Label>Description</Label>
                                <div>
                                  <p className="text-muted-foreground leading-relaxed mb-4">
                                    {business?.description ||
                                      "No description provided."}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {business.website && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      window.open(business.website, "_blank")
                                    }
                                  >
                                    <Globe className="w-5 h-5" />
                                  </Button>
                                )}
                                {business.phoneNumber && (
                                  <Button asChild variant="outline" size="icon">
                                    <a href={`tel:${business.phoneNumber}`}>
                                      <Phone className="w-5 h-5" />
                                    </a>
                                  </Button>
                                )}
                                <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {business.location?.address ??
                                      `${business.location?.city ?? ""}${
                                        business.location?.state
                                          ? ", " + business.location.state
                                          : ""
                                      }`}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Photos gallery (lazy loaded) */}
                          <BusinessPhotoGallery
                            business={business}
                            businessImages={businessImages}
                          />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                          {/* Contact & Location */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Location & Contact
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  Address
                                </p>
                                <p>{business.location?.address ?? "-"}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  City
                                </p>
                                <p>
                                  {business.location?.city ?? "-"},{" "}
                                  {business.location?.state ?? "-"}
                                </p>
                              </div>
                              {business.phoneNumber && (
                                <div>
                                  <p className="text-muted-foreground text-xs">
                                    Phone
                                  </p>
                                  <p>{business.phoneNumber}</p>
                                </div>
                              )}
                              {business.website && (
                                <div>
                                  <p className="text-muted-foreground text-xs">
                                    Website
                                  </p>
                                  <Link
                                    href={business.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                  >
                                    {business.website}
                                  </Link>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Lazy map - will only load map JS when near viewport */}
                          {business.location?.latitude &&
                            business.location?.longitude && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                  <div className="p-3">
                                    <LazyMapObserver
                                      business={business}
                                      rootMargin="400px"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Opening Hours */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Opening Hours
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            {business.openingHours?.weekdayText?.length ? (
                              business.openingHours.weekdayText.map(
                                (t: string, idx: number) => (
                                  <div key={idx}>{t}</div>
                                )
                              )
                            ) : (
                              <div>No opening hours provided.</div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Social Links */}
                        {business.socialLinks && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Follow & Share</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-2">
                              {business.socialLinks.facebook && (
                                <Button variant="outline" size="icon" asChild>
                                  <a
                                    href={business.socialLinks.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Facebook className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                              {business.socialLinks.instagram && (
                                <Button variant="outline" size="icon" asChild>
                                  <a
                                    href={business.socialLinks.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Instagram className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                              {business.socialLinks.twitter && (
                                <Button variant="outline" size="icon" asChild>
                                  <a
                                    href={business.socialLinks.twitter}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Twitter className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                              {business.socialLinks.linkedin && (
                                <Button variant="outline" size="icon" asChild>
                                  <a
                                    href={business.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Linkedin className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                              {business.socialLinks.tiktok && (
                                <Button variant="outline" size="icon" asChild>
                                  <a
                                    href={business.socialLinks.tiktok}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Music2 className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <MenuManager businessId={business.id} />
                <ServiceManager businessId={business.id} />
                {/* <OrdersTable businessId={business.id} /> */}
                {/* <ReviewsPanel businessId={business.id} /> */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BusinessReviews businessId={business.id} />
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
