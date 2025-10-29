"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { File } from "@/server/interfaces/File";
import { FileCategoryEnum } from "@/server/enums";
import { BusinessReviews } from "./business-reviews";
import { BusinessMiniMap } from "./business-mini-map";
import { Separator } from "@/components/ui/separator";
import { BusinessSkeleton } from "./business-skeleton";
import { useBusinessFiles } from "@/server/queries/use-business-files";
import { useBusinessById } from "@/server/queries/use-businesses-query";
import { MapPin, Star, Heart, Globe, Phone, Share2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layouts/Header";
import ErrorBox from "@/components/atoms/error-box";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBusinessById({
    businessId: Number(id),
  });

  const business = data?.responseData;
  console.log("Business: ", business);

  const { data: businessFiles, isLoading: isLoadingBusinessFiles } =
    useBusinessFiles({
      businessId: Number(id),
    });

  const cover: File | null | undefined =
    !isLoadingBusinessFiles && businessFiles && businessFiles.length
      ? businessFiles.find(
          (file: File) => file.category === FileCategoryEnum.BUSINESS_COVER
        )
      : null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: business?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <section>
      <Header />
      <div className="container mx-auto px-4 py-2 sm:py-8 max-w-5xl">
        {isLoading && <BusinessSkeleton />}

        {isError ||
          (!business && <ErrorBox message=" Unable to load business." />)}
        {/* Header Section */}
        {!isLoading && business && (
          <>
            <div className="mb-4 md:mb-6">
              <h1 className="text-shine text-3xl lg:text-4xl font-bold">
                Business Details
              </h1>
            </div>
            <section className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Cover Image */}
              <div className="relative w-full md:w-1/2 h-72 rounded-2xl overflow-hidden">
                <Image
                  src={cover?.fullPath || "/images/placeholder.jpg"}
                  alt={business?.name}
                  fill
                  className="object-cover"
                />
                {business?.isVerified && (
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                    Verified
                  </Badge>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold">{business?.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  <span>
                    {business?.location?.address ||
                      `${business?.location?.city}, ${business?.location?.state}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-medium">
                    {business?.rating?.toFixed(1) ?? "0.0"}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({business?.totalReviews ?? 0} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{business?.type}</Badge>
                  {business?.cuisines?.length > 0 &&
                    business.cuisines.map((c: string) => (
                      <Badge key={c} variant="secondary" className="capitalize">
                        {c}
                      </Badge>
                    ))}
                </div>

                <div className="flex gap-3 mt-4">
                  {business?.website && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(business?.website, "_blank")}
                    >
                      <Globe size={16} />
                    </Button>
                  )}
                  {business?.phoneNumber && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={`tel:${business?.phoneNumber}`}>
                        <Phone size={16} />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Heart size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </section>
            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-2 lg:space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="menu">Menu / Services</TabsTrigger>
              </TabsList>
              <Separator />

              <TabsContent value="overview" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {business?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {business?.description || "No description available."}
                    </p>

                    {/* Mini Map */}
                    {business?.location?.latitude &&
                      business?.location?.longitude && (
                        <div className="mt-6">
                          <BusinessMiniMap business={business} />
                          <p className="text-sm text-muted-foreground mt-2">
                            {business?.location?.address ||
                              `${business?.location?.city}, ${business?.location?.state}`}
                          </p>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="pt-4">
                <BusinessReviews businessId={business?.id} />
              </TabsContent>

              <TabsContent value="menu" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Menu / Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This business hasn’t uploaded its menu yet.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </section>
  );
}
