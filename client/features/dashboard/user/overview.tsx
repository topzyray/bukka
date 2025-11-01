"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, Star, TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BukkaButton } from "@/components/ui/button-variants";
import { useAuth } from "@/providers";
import { TextHelper } from "@/helpers";
import { BusinessCard } from "@/features/business/components/business-card";
import { Business } from "@/data/interfaces/Business";

export function UserOverview() {
  const { user } = useAuth();

  const userStats = [
    {
      title: "Favorite Restaurants",
      value: (user?.favorites && user?.favorites.length) ?? 0,
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Places Visited",
      value: "47",
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      title: "Reviews Written",
      value: "23",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Member Since",
      value: TextHelper.getFormattedDate(user?.createdAt as string),
      icon: Calendar,
      color: "text-green-500",
    },
  ];

  const recentlyVisited = [
    {
      id: "1",
      placeId: "ChIJ1",
      name: "Mama Cass",
      rating: 4.8,
      priceLevel: 2,
      address: "Victoria Island, Lagos",
      location: { lat: 6.4474, lng: 3.4266 },
      types: ["restaurant", "food"],
      photos: [{ url: "/api/placeholder/300/200", width: 300, height: 200 }],
      isSaved: true,
      distanceMeters: 800,
      opening_hours: {
        openNow: true,
        periods: [],
        weekdayText: [],
      },
    },
  ];

  const recentActivity = [
    {
      action: "Added to favorites",
      restaurant: "Mama Cass",
      time: "2 hours ago",
    },
    { action: "Left a review", restaurant: "Spice Garden", time: "1 day ago" },
    {
      action: "Checked in",
      restaurant: "The Burger Joint",
      time: "3 days ago",
    },
    {
      action: "Added to favorites",
      restaurant: "Pizza Palace",
      time: "1 week ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s what&apos;s been happening with your food journey
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="shadow-card hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recently Visited */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recently Visited
                </CardTitle>
                <CardDescription>
                  Places you&apos;ve been to recently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentlyVisited.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business as unknown as Business}
                    variant="compact"
                  />
                ))}
                <BukkaButton variant="outline" className="w-full">
                  View All Visited Places
                </BukkaButton>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions on Bukka</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.restaurant}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Things you might want to do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BukkaButton
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Heart className="w-6 h-6" />
                  <span>View Favorites</span>
                </BukkaButton>
                <BukkaButton
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <MapPin className="w-6 h-6" />
                  <span>Explore Nearby</span>
                </BukkaButton>
                <BukkaButton
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Star className="w-6 h-6" />
                  <span>Write Review</span>
                </BukkaButton>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Unlock badges by exploring more restaurants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm py-2 px-3">
                  🏆 Food Explorer
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-3">
                  ⭐ Top Reviewer
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-2 px-3 opacity-50"
                >
                  🍕 Pizza Lover (5/10)
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-2 px-3 opacity-50"
                >
                  🌟 Local Guide (2/15)
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
