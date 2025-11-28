"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Utensils,
  Clock,
  TrendingUp,
  HandHeart,
} from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { TypeAnimation } from "react-type-animation";
import { Business } from "@/data/interfaces/Business";
import { useInfiniteBusinessesQuery } from "@/data/queries/use-businesses-query";
import { BusinessCard } from "../business/components/business-card";
import { TextHelper } from "@/helpers";
import { BusinessTypeEnum } from "@/data/enums/BusinessTypeEnum";
import { useRouter } from "next/navigation";
import { SearchBox } from "@/components/ui/search-box";
import { ErrorBox } from "@/components/ui/error-box";
import { BusinessCardSkeleton } from "../business/components/business-card-skeleton";
import { useAuth } from "@/providers";

const categories = [
  { name: BusinessTypeEnum.RESTAURANT, icon: "🍛", count: "120+" },
  { name: BusinessTypeEnum.FAST_FOOD, icon: "🍔", count: "200+" },
  { name: BusinessTypeEnum.FOOD_VENDOR, icon: "🛒", count: "80+" },
  { name: BusinessTypeEnum.BAR, icon: "🍷", count: "50+" },
  { name: BusinessTypeEnum.BAKERY, icon: "🍰", count: "60+" },
  { name: BusinessTypeEnum.LOUNGE, icon: "🛋️", count: "40+" },
  { name: BusinessTypeEnum.STREET_EATRY, icon: "🌭", count: "70+" },
  { name: BusinessTypeEnum.CATERING, icon: "🍽️", count: "30+" },
  { name: BusinessTypeEnum.GROCERY, icon: "🥦", count: "90+" },
  { name: BusinessTypeEnum.DELIVERY_SERVICE, icon: "🚚", count: "25+" },
  { name: BusinessTypeEnum.OTHER, icon: "❓", count: "10+" },
];

export function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useInfiniteBusinessesQuery({});

  const featuredBusinesses: Business[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="relative h-screen">
        <Header />

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
                  className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 dark:text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <span>Discover Amazing</span>
                  <br />
                  <span>
                    <TypeAnimation
                      speed={{ type: "keyStrokeDelayInMs", value: 150 }}
                      sequence={[
                        TextHelper.normalizeText(BusinessTypeEnum.RESTAURANT),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.FAST_FOOD),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.FOOD_VENDOR),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.BAR),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.LOUNGE),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.BAKERY),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.STREET_EATRY),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.GROCERY),
                        3000,
                        TextHelper.normalizeText(BusinessTypeEnum.CATERING),
                        3000,
                        TextHelper.normalizeText(
                          BusinessTypeEnum.DELIVERY_SERVICE
                        ),
                        3000,
                        // TextHelper.normalizeText(BusinessTypeEnum.OTHER) +
                        //   " " +
                        //   "Services",
                        // 3000,
                      ]}
                      wrapper="span"
                      repeat={Infinity}
                      className="capitalize"
                    />{" "}
                  </span>{" "}
                  <br />
                  Near You
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl mb-8 opacity-90 dark:text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Find the perfect dining experience with Bukka&apos;s curated
                  buiness discovery
                </motion.p>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="flex flex-col md:flex-row gap-2 md:gap-2 glass rounded-2xl p-2">
                    <div className="relative flex-1">
                      <SearchBox
                        placeholder="Search businesses, cuisines, or services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 md:h-full border-none dark:bg-transparent"
                      />
                    </div>

                    <BukkaButton
                      variant="hero"
                      size="lg"
                      className="md:px-8"
                      onClick={() =>
                        router.push(`/businesses?search=${searchQuery}`)
                      }
                      disabled={searchQuery.length < 2}
                    >
                      <Search className="w-5 mr-2" />
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
                    onClick={() => router.push("/businesses?filter=near_me")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Near Me
                  </BukkaButton>
                  <BukkaButton
                    variant="glass"
                    size="sm"
                    onClick={() => router.push("/businesses?sort=rating")}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Top Rated
                  </BukkaButton>
                  <BukkaButton
                    variant="glass"
                    size="sm"
                    onClick={() => router.push("/businesses?filter=openNow")}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Open Now
                  </BukkaButton>
                </motion.div>

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
                      router.push(user ? "/businesses/recommend" : "/signin")
                    }
                    className="py-6 px-8 font-bold text-lg"
                  >
                    Recommend A Business
                    <HandHeart className="w-4 h-4 mr-2" />
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
              {/* Explore different cuisines and dining styles */}
              Explore local food businesses by cuisine and service
            </p>
          </motion.div>

          <div
            // className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            className="flex flex-wrap justify-center items-center gap-4"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push(`/businesses?type=${category.name.toLowerCase()}`)
                }
                className="w-full sm:w-xs"
              >
                <Card className="cursor-pointer hover:shadow-card transition-smooth text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1 uppercase">
                      {TextHelper.normalizeText(category.name)}
                    </h3>
                    {/* <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p> */}
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
                Featured Businesses
              </h2>
              <p className="text-muted-foreground text-lg">
                Hand-picked favorites from our community
              </p>
            </div>
            <BukkaButton variant="outline" asChild>
              <Link href="/businesses">
                View All
                <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </BukkaButton>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-content-center">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))
            ) : featuredBusinesses.length ? (
              featuredBusinesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <BusinessCard business={business} />
                </motion.div>
              ))
            ) : isError ? (
              <ErrorBox error={error} />
            ) : (
              <p>No featured business available yet.</p>
            )}
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
                Ready to Discover Local Food Businesses?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of food lovers discovering amazing spots every
                day
              </p>
              <div className="flex flex-wrap flex-row gap-4 justify-center">
                <Link href="/signup">
                  <BukkaButton variant="float" size="lg" asChild>
                    Get Started Free
                    <Utensils className="w-5 h-5 ml-2" />
                  </BukkaButton>
                </Link>
                <Link href="/businesses">
                  <BukkaButton variant="glass" size="lg" asChild>
                    Explore Businesses
                    <MapPin className="w-5 h-5 ml-2" />
                  </BukkaButton>
                </Link>
                <Link href="/businesses/recommend">
                  <BukkaButton variant="warm" size="lg" asChild>
                    Recommend Businesses
                    <HandHeart className="w-5 h-5 ml-2" />
                  </BukkaButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
