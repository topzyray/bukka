"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  MapPin,
  Phone,
  Globe,
  Clock,
  Share,
  Camera,
} from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layouts/Header";
import Image from "next/image";
import { Footer } from "@/components/layouts/Footer";

const RestaurantDetail = () => {
  // Mock restaurant data
  const restaurant = {
    id: "1",
    name: "Mama Cass",
    rating: 4.8,
    reviewCount: 234,
    priceLevel: 2,
    cuisine: "Nigerian",
    address: "23 Admiralty Way, Lekki Phase 1, Lagos",
    phone: "+234 801 234 5678",
    website: "www.mamacass.ng",
    isOpen: true,
    openingHours: [
      "Monday: 10:00 AM - 10:00 PM",
      "Tuesday: 10:00 AM - 10:00 PM",
      "Wednesday: 10:00 AM - 10:00 PM",
      "Thursday: 10:00 AM - 10:00 PM",
      "Friday: 10:00 AM - 11:00 PM",
      "Saturday: 9:00 AM - 11:00 PM",
      "Sunday: 9:00 AM - 9:00 PM",
    ],
    description:
      "Authentic Nigerian cuisine in a warm, welcoming atmosphere. Known for our traditional jollof rice, pepper soup, and grilled fish.",
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
    ],
    reviews: [
      {
        id: "1",
        user: "John D.",
        rating: 5,
        text: "Amazing food! The jollof rice is the best I've had in Lagos.",
        date: "2 days ago",
      },
      {
        id: "2",
        user: "Sarah M.",
        rating: 4,
        text: "Great atmosphere and friendly staff. The pepper soup was excellent.",
        date: "1 week ago",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Hero Section */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <Image
              src={restaurant.photos[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              width={250}
              height={250}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-2 text-white">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="opacity-80">
                      ({restaurant.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <BukkaButton
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white"
                  >
                    <Heart className="w-4 h-4" />
                  </BukkaButton>
                  <BukkaButton
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white"
                  >
                    <Share className="w-4 h-4" />
                  </BukkaButton>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{restaurant.cuisine}</Badge>
                    <Badge
                      variant={restaurant.isOpen ? "default" : "destructive"}
                    >
                      {restaurant.isOpen ? "Open" : "Closed"}
                    </Badge>
                    <Badge variant="outline">
                      {"₦".repeat(restaurant.priceLevel)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {restaurant.description}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <BukkaButton variant="outline" className="flex-col h-auto py-4">
                  <Phone className="w-5 h-5 mb-1" />
                  <span className="text-sm">Call</span>
                </BukkaButton>
                <BukkaButton variant="outline" className="flex-col h-auto py-4">
                  <MapPin className="w-5 h-5 mb-1" />
                  <span className="text-sm">Directions</span>
                </BukkaButton>
                <BukkaButton variant="outline" className="flex-col h-auto py-4">
                  <Globe className="w-5 h-5 mb-1" />
                  <span className="text-sm">Website</span>
                </BukkaButton>
              </div>

              {/* Photos */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {restaurant.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={photo}
                          alt={`${restaurant.name} photo ${index + 1}`}
                          className="w-full h-full object-cover hover-scale cursor-pointer"
                          width={100}
                          height={100}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {restaurant.reviews.map((review) => (
                    <div key={review.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {review.user[0]}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {review.user}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {review.text}
                      </p>
                      <Separator />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="text-sm">{restaurant.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm">{restaurant.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Website
                    </p>
                    <p className="text-sm text-primary">{restaurant.website}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {restaurant.openingHours.map((hours, index) => (
                      <div key={index} className="text-sm">
                        {hours}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;
