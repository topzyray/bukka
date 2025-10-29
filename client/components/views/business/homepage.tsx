// app/page.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  Search,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { Input } from "@/components/ui/input";
import { BukkaButton } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessCard } from "@/components/views/business/BusinessCard";
import { useBusinesses } from "@/hooks/useBusinesses";
import { Skeleton } from "@/components/ui/skeleton";
import { debounce } from "lodash";

const categories = [
  { name: "Nigerian", icon: "🍛" },
  { name: "Italian", icon: "🍝" },
  { name: "Asian", icon: "🍜" },
  { name: "Fast Food", icon: "🍔" },
  { name: "Desserts", icon: "🍰" },
  { name: "Coffee", icon: "☕" },
];

export default function HomePage() {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState(""); // debounced real query

  // debounce local input -> query param used by useBusinesses
  const debouncedSetQuery = useMemo(
    () => debounce((v: string) => setQuery(v), 300),
    []
  );
  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQ(e.target.value);
      debouncedSetQuery(e.target.value);
    },
    [debouncedSetQuery]
  );

  const { data, isLoading, isError } = useBusinesses({
    q: query,
    pageSize: 12,
    sort: "rating",
  });
  const businesses = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      {/* Hero */}
      <section className="relative h-screen">
        <div className="flex justify-center items-center h-[80vh]">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="/images/hero-food.jpg"
              alt="Delicious food spread"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative z-10 text-center">
            <div className="container mx-auto px-4 py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                  Discover Amazing
                  <br />
                  <span>
                    <TypeAnimation
                      sequence={[
                        "Businesses",
                        1000,
                        "Food Spots",
                        1000,
                        "Cafes",
                        1000,
                      ]}
                      wrapper="span"
                      className="text-accent"
                      repeat={Infinity}
                    />
                  </span>{" "}
                  Near You
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  Find the perfect dining or food service experience with Bukka
                </p>

                <div className="max-w-2xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-4 glass rounded-2xl p-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        value={q}
                        onChange={onSearchChange}
                        placeholder="Search businesses, cuisines, or services..."
                        className="pl-12 pr-4 py-6 text-lg border-0 bg-transparent focus:ring-0"
                      />
                    </div>
                    <BukkaButton
                      variant="hero"
                      size="xl"
                      className="md:px-8"
                      asChild
                    >
                      <Link
                        href={`/businesses?q=${encodeURIComponent(
                          query || ""
                        )}`}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </Link>
                    </BukkaButton>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <BukkaButton variant="glass" size="sm" asChild>
                    <Link href="/businesses?filter=near_me">
                      <MapPin className="w-4 h-4 mr-2" />
                      Near Me
                    </Link>
                  </BukkaButton>
                  <BukkaButton variant="glass" size="sm" asChild>
                    <Link href="/businesses?sort=rating">
                      <Star className="w-4 h-4 mr-2" />
                      Top Rated
                    </Link>
                  </BukkaButton>
                  <BukkaButton variant="glass" size="sm" asChild>
                    <Link href="/businesses?filter=openNow">
                      <Clock className="w-4 h-4 mr-2" />
                      Open Now
                    </Link>
                  </BukkaButton>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore local food businesses by cuisine and service
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link href={`/categories/${cat.name.toLowerCase()}`}>
                  <Card className="cursor-pointer hover:shadow-card transition p-6 text-center">
                    <CardContent className="p-0">
                      <div className="text-4xl mb-3">{cat.icon}</div>
                      <h3 className="font-semibold mb-1">{cat.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))
              : businesses.slice(0, 6).map((b: any, idx: number) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <BusinessCard business={b} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="hero-gradient rounded-3xl p-12 text-white">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Discover Local Food Businesses?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of food lovers finding local gems on Bukka
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <BukkaButton variant="float" size="lg" asChild>
                  <Link href="/auth/signup">
                    Get Started Free <Utensils className="w-5 h-5 ml-2" />
                  </Link>
                </BukkaButton>
                <BukkaButton variant="glass" size="lg" asChild>
                  <Link href="/businesses">
                    Explore Businesses <MapPin className="w-5 h-5 ml-2" />
                  </Link>
                </BukkaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
