"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MenuManager } from "../vendor/components/menu-manager";
import { ServiceManager } from "../vendor/components/service-manager";
import { useBusinessById } from "@/data/queries/use-businesses-query";
import {
  Badge,
  Button,
  ErrorBox,
  SingleFileUploader,
  LazyImage,
} from "@/components/ui";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { CreateUpdateBusinessModal } from "../vendor/modals/create-update-business-modal";
import { useQueryClient } from "@tanstack/react-query";
import { Business } from "@/data/interfaces/Business";
import {
  Camera,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  Music2,
  Phone,
  Star,
  Twitter,
} from "lucide-react";
import { LazyMapObserver } from "@/features/business/components/lazy-map-observer";
import Link from "next/link";
import { BusinessReviews } from "@/features/business/components/business-reviews";
import { FileCategoryEnum } from "@/data/enums";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { BusinessHelper } from "@/features/business/helper/bussiness-helper";
import { File } from "@/data/interfaces/File";
import { motion } from "framer-motion";
import Image from "next/image";

export const BusinessDetails: React.FC = () => {
  const { id } = useParams() as unknown as { id: number };
  const queryClient = useQueryClient();
  const router = useRouter();

  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Business> | undefined>(
    undefined
  );

  const { data, isLoading, isError, error } = useBusinessById({
    businessId: id,
  });

  const business = data?.responseData;

  const { data: businessFiles, isLoading: isLoadingFiles } = useBusinessFiles({
    businessId: Number(id),
  });

  // pick cover and other photos
  const cover: File | null | undefined =
    !isLoadingFiles && businessFiles && businessFiles.length
      ? businessFiles.find(
          (file: File) => file.category === FileCategoryEnum.BUSINESS_COVER
        ) ?? null
      : null;

  const photos: File[] =
    !isLoadingFiles && businessFiles
      ? businessFiles.filter(
          (file: File) => file.category === FileCategoryEnum.BUSINESS_IMAGE
        )
      : [];

  // compute open now robustly
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
          <h1 className="text-2xl font-bold">Details of {business?.name}</h1>
          {/* <p className="text-sm text-muted-foreground">
                  My business manage page
                </p> */}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleEdit}>Edit</Button>
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
                        <Image
                          src={cover?.fullPath || "/images/placeholder.jpg"}
                          alt={business.name || "business cover"}
                          fill
                          className="object-cover"
                          priority={!!cover} // prioritize if there is a cover
                        />
                        <div className="absolute inset-0 bg-black/28" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                              {business.name}
                            </h1>
                            <div className="flex items-center gap-3 text-white">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {business.rating?.toFixed(1) ?? "0.0"}
                              </span>
                              <span className="opacity-80">
                                ({business.totalReviews ?? 0} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* GRID */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Info Card */}
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="uppercase">
                                  {business.type}
                                </Badge>
                                <Badge
                                  variant={openNow ? "success" : "destructive"}
                                >
                                  {openNow ? "Open Now" : "Closed"}
                                </Badge>
                                {business.cuisines?.map((c: string) => (
                                  <Badge
                                    key={c}
                                    variant="secondary"
                                    className="capitalize"
                                  >
                                    {c}
                                  </Badge>
                                ))}
                              </div>

                              <p className="text-muted-foreground leading-relaxed mb-4">
                                {business.description ||
                                  "No description provided."}
                              </p>

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
                          {photos.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Camera className="w-5 h-5" />
                                  Photos
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {photos.map((p, i) => (
                                    <div
                                      key={p.id ?? i}
                                      className="aspect-square rounded-lg overflow-hidden"
                                    >
                                      <LazyImage
                                        src={p.fullPath}
                                        alt={`${business.name} photo ${i + 1}`}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
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
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <SingleFileUploader
                      formName=""
                      uploadFn={(n): Promise<any> => {
                        return Promise.resolve(n);
                      }}
                    /> */}
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
