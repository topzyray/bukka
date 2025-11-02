"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Filter, Search } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/features/business/components/business-card";
import { useFavorites } from "@/data/queries/use-favorites";

export function Favorites() {
  const { data: mockFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary fill-primary" />
                My Favorites
              </h1>
              <p className="text-muted-foreground mt-1">
                {mockFavorites.length} saved restaurants
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search your favorites..."
                className="pl-10"
              />
            </div>
            <BukkaButton variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </BukkaButton>
          </div>

          {/* Favorites List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFavorites.map((favorite: any, index: number) => (
              <motion.div
                key={favorite.restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <BusinessCard business={favorite.restaurant} />
              </motion.div>
            ))}
          </div>

          {/* Empty State - Hidden when there are favorites */}
          {mockFavorites.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No favorites yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start exploring restaurants and save your favorites here
              </p>
              <BukkaButton asChild>
                <Link href="/businesses">Discover Restaurants</Link>
              </BukkaButton>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
