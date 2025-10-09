"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Utensils,
  Clock,
  TrendingUp,
} from "lucide-react";

import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { RestaurantCard } from "@/components/views/restaurant/RestaurantCard";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { TypeAnimation } from "react-type-animation";

// Mock data for featured restaurants
const featuredRestaurants = [
  {
    id: "1",
    placeId: "place1",
    name: "Mama's Kitchen",
    address: "123 Food Street, Downtown",
    location: { lat: 40.7128, lng: -74.006 },
    rating: 4.8,
    priceLevel: 2,
    types: ["restaurant", "nigerian", "african"],
    photos: [],
    isSaved: false,
    distanceMeters: 500,
    opening_hours: { open_now: true } as any,
  },
  {
    id: "2",
    placeId: "place2",
    name: "Spice Garden",
    address: "456 Flavor Ave, Midtown",
    location: { lat: 40.758, lng: -73.9855 },
    rating: 4.6,
    priceLevel: 3,
    types: ["restaurant", "indian", "vegetarian"],
    photos: [],
    isSaved: true,
    distanceMeters: 1200,
    opening_hours: { open_now: false } as any,
  },
];

const categories = [
  { name: "Nigerian", icon: "🍛", count: "120+" },
  { name: "Italian", icon: "🍝", count: "85+" },
  { name: "Asian", icon: "🍜", count: "95+" },
  { name: "Fast Food", icon: "🍔", count: "200+" },
  { name: "Desserts", icon: "🍰", count: "60+" },
  { name: "Coffee", icon: "☕", count: "75+" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Header />
        {/* Background Image */}
        <div className="flex justify-center items-center h-[80vh]">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/hero-food.jpg"
              alt="Delicious food spread"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <div className="container mx-auto px-4 py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center text-primary max-w-4xl lg:max-w-6xl mx-auto"
              >
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Discover Amazing
                  <br />
                  <span>
                    <TypeAnimation
                      sequence={[
                        "Restaurants",
                        1000,
                        "Super Bukka",
                        1000,
                        "Hot Sharwama Spot",
                        1000,
                        "Special Eatries",
                        1000,
                        "Delicious Mama Put",
                        1000,
                      ]}
                      wrapper="h1"
                      className="text-accent"
                      repeat={Infinity}
                    />
                  </span>{" "}
                  Near You
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl mb-8 opacity-90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Find the perfect dining experience with Bukka&apos;s curated
                  restaurant discovery
                </motion.p>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="flex flex-col md:flex-row gap-4 glass rounded-2xl p-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Search restaurants, cuisines, or dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-6 text-lg border-0 bg-transparent focus:ring-0"
                      />
                    </div>
                    <BukkaButton variant="hero" size="xl" className="md:px-8">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </BukkaButton>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="flex flex-wrap justify-center gap-4 mt-8"
                >
                  <BukkaButton
                    variant="glass"
                    size="sm"
                    onClick={() =>
                      (window.location.href = "/search?filter=near_me")
                    }
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Near Me
                  </BukkaButton>
                  <BukkaButton
                    variant="glass"
                    size="sm"
                    onClick={() =>
                      (window.location.href = "/search?sort=rating")
                    }
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Top Rated
                  </BukkaButton>
                  <BukkaButton
                    variant="glass"
                    size="sm"
                    onClick={() =>
                      (window.location.href = "/search?filter=open_now")
                    }
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Open Now
                  </BukkaButton>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-6xl opacity-20"
          >
            🍽️
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 right-10 text-5xl opacity-20"
          >
            🍕
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore different cuisines and dining styles
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="cursor-pointer hover:shadow-card transition-smooth text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Restaurants
              </h2>
              <p className="text-muted-foreground text-lg">
                Hand-picked favorites from our community
              </p>
            </div>
            <BukkaButton variant="outline" asChild>
              <Link href="/search">
                View All
                <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </BukkaButton>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto "
          >
            <div className="hero-gradient rounded-3xl p-12 text-white bg-primary">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Next Favorite Meal?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of food lovers discovering amazing restaurants
                every day
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <BukkaButton variant="float" size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <Utensils className="w-5 h-5 ml-2" />
                  </Link>
                </BukkaButton>
                <BukkaButton variant="glass" size="lg" asChild>
                  <Link href="/search">
                    Explore Restaurants
                    <MapPin className="w-5 h-5 ml-2" />
                  </Link>
                </BukkaButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
