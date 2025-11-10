"use client";

import React, { JSX, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Share2,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Music2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BukkaButton } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { ErrorBox } from "@/components/ui/error-box";
import { BusinessReviews } from "./components/business-reviews";
import { BusinessSkeleton } from "./components/business-skeleton";
import { FileCategoryEnum } from "@/data/enums";
import { File } from "@/data/interfaces/File";
import { useBusinessById } from "@/data/queries/use-businesses-query";
import { useBusinessFiles } from "@/data/queries/use-business-files";
import { BusinessHelper } from "./helper/bussiness-helper";
import { LazyMapObserver } from "./components/lazy-map-observer";
import Link from "next/link";
import { FavoriteButton } from "./components/favorite-button";
import { Business } from "@/data/interfaces/Business";
import { Label, Separator } from "@/components/ui";
import { TextHelper } from "@/helpers";
import { BusinessPhotoGallery } from "./components/business-photo-gallery";

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
  // compute open now robustly
  const openNow = useMemo(
    () => BusinessHelper.isOpenNow(business?.openingHours),
    [business?.openingHours]
  );

  const handleShare = async () => {
    try {
      if (!business) return;
      if (navigator.share) {
        await navigator.share({
          title: business.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Success", {
          description: "Link copied to clipboard!",
        });
      }
    } catch {
      // swallow but optionally show
      toast.error("Failure", {
        description: "Unable to copy/share link.",
      });
    }
  };

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
                    {business?.averageRating?.toFixed(1) ?? "0.0"}
                  </span>
                  <span className="opacity-80">
                    ({business?.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  title={"Share Business"}
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <FavoriteButton
                  variant="outline"
                  businessId={business?.id}
                  className="rounded-lg"
                  iconClassName="w-4 h-4 text-red-500"
                />
              </div>
            </div>
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
                      <Badge variant="outline" className="uppercase">
                        {TextHelper.normalizeText(business?.type)}
                      </Badge>
                    </div>

                    <Separator orientation="vertical" />

                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <Badge variant={openNow ? "success" : "destructive"}>
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

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {business.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-3">
                    {business.website && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(business.website, "_blank")}
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

              {/* Menu & Services placeholder (ready for plugging real data) */}
              <Card>
                <CardHeader>
                  <CardTitle>Menu & Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This business hasn’t uploaded its menu or services yet.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <BukkaButton>Order Menu</BukkaButton>
                    <BukkaButton variant="secondary">
                      Request Service
                    </BukkaButton>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <BusinessReviews businessId={business?.id} />
                </CardContent>
              </Card>
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
                    <p className="text-muted-foreground text-xs">Address</p>
                    <p>{business.location?.address ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">City</p>
                    <p>
                      {business.location?.city ?? "-"},{" "}
                      {business.location?.state ?? "-"}
                    </p>
                  </div>
                  {business.phoneNumber && (
                    <div>
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p>{business.phoneNumber}</p>
                    </div>
                  )}
                  {business.website && (
                    <div>
                      <p className="text-muted-foreground text-xs">Website</p>
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
              {business.location?.latitude && business.location?.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-3">
                      <LazyMapObserver business={business} rootMargin="400px" />
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
                      (t: string, idx: number) => <div key={idx}>{t}</div>
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
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
