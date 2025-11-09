"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Filter, Search, Loader2 } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/features/business/components/business-card";
import { useFavorites } from "@/data/queries/use-favorites";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { extractErrorMessage } from "@/utils";

export function UserFavorites() {
  const { data: favourites, isLoading, isError, error } = useFavorites();
  const userFavourites = favourites?.responseData?.data;

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            My Favorites
          </h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : userFavourites && userFavourites.length ? (
              userFavourites.length
            ) : isError ? (
              0
            ) : (
              0
            )}{" "}
            saved businesses
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <CircularLoader />
        ) : userFavourites?.length ? (
          userFavourites.map((favorite: any, index: number) => (
            <motion.div
              key={favorite?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <BusinessCard business={favorite?.business} inDashboard />
            </motion.div>
          ))
        ) : isError ? (
          extractErrorMessage(error)
        ) : null}
      </div>

      {!isLoading &&
        !isError &&
        userFavourites &&
        userFavourites.length === 0 && (
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
              Start exploring businesses and save your favorites here
            </p>
            <BukkaButton asChild>
              <Link href="/businesses">Discover Businesses</Link>
            </BukkaButton>
          </motion.div>
        )}
    </section>
  );
}
