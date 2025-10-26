"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Heart, MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BukkaButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Restaurant } from "@/server/interfaces/Restaurant";
import Image from "next/image";

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: "default" | "compact" | "featured";
  className?: string;
  onClick?: () => void;
}

export function RestaurantCard({
  restaurant,
  variant = "default",
  className,
  onClick,
}: RestaurantCardProps) {
  const [isFavorited, setIsFavorited] = React.useState(restaurant.isSaved);
  const [imageError, setImageError] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: Call API to save/unsave restaurant
  };

  const renderRating = () => {
    if (!restaurant.rating) return null;

    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-accent text-accent" />
        <span className="text-sm font-medium">
          {restaurant.rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderPriceLevel = () => {
    if (!restaurant.priceLevel) return null;

    return (
      <div className="flex items-center">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "text-sm",
              i < restaurant?.priceLevel
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            $
          </span>
        ))}
      </div>
    );
  };

  const renderDistance = () => {
    if (!restaurant.distanceMeters) return null;

    const distance =
      restaurant.distanceMeters < 1000
        ? `${restaurant.distanceMeters}m`
        : `${(restaurant.distanceMeters / 1000).toFixed(1)}km`;

    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span className="text-xs">{distance}</span>
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn("cursor-pointer", className)}
        onClick={onClick}
      >
        <Card className="overflow-hidden shadow-card hover:shadow-elegant transition-smooth py-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {restaurant.photos?.[0] && !imageError ? (
                  <Image
                    src={restaurant.photos[0].url}
                    alt={restaurant.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full warm-gradient flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {restaurant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {restaurant.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {restaurant.address}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {renderRating()}
                  {renderPriceLevel()}
                  {renderDistance()}
                </div>
              </div>

              <BukkaButton
                variant="ghost"
                size="icon"
                className="flex-shrink-0 w-8 h-8"
                onClick={handleFavoriteClick}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
              </BukkaButton>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn("cursor-pointer", className)}
      onClick={onClick}
    >
      <Card className="py-0 overflow-hidden shadow-card hover:shadow-elegant transition-smooth group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {restaurant.photos?.[0] && !imageError ? (
            <Image
              src={restaurant.photos[0].url}
              alt={restaurant.name}
              width={100}
              height={100}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full warm-gradient flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {restaurant.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <BukkaButton
            variant="glass"
            size="icon"
            className="absolute top-3 right-3 w-8 h-8"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              )}
            />
          </BukkaButton>

          {/* Status Badge */}
          {restaurant.opening_hours?.openNow !== undefined && (
            <Badge
              variant={
                restaurant.opening_hours.openNow ? "default" : "secondary"
              }
              className="absolute bottom-3 left-3"
            >
              <Clock className="w-3 h-3 mr-1" />
              {restaurant.opening_hours.openNow ? "Open" : "Closed"}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div>
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {restaurant.address}
              </p>
            </div>

            {/* Rating and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderRating()}
                {renderPriceLevel()}
              </div>
              {renderDistance()}
            </div>

            {/* Types */}
            {restaurant.types && restaurant.types.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {restaurant.types.slice(0, 3).map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {restaurant.phone && (
                <BukkaButton variant="outline" size="sm" className="flex-1">
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </BukkaButton>
              )}
              <BukkaButton variant="outline" size="sm" className="flex-1">
                <MapPin className="w-3 h-3 mr-1" />
                Directions
              </BukkaButton>
              {restaurant.website && (
                <BukkaButton variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Website
                </BukkaButton>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
