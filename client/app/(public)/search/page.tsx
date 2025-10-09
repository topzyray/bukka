"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Filter, MapPin, Grid, List } from "lucide-react";
import { RestaurantCard } from "@/components/views/restaurant/RestaurantCard";
import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { Header } from "../../../components/layouts/Header";
import { Footer } from "../../../components/layouts/Footer";

// Mock data for search results
const mockRestaurants = [
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
  // Add more mock restaurants...
];

const filters = [
  "All",
  "Nigerian",
  "Italian",
  "Asian",
  "Fast Food",
  "Vegetarian",
  "Desserts",
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [results, setResults] = useState(mockRestaurants);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "popular">(
    "rating"
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Simulate search filtering
    let filtered = mockRestaurants;

    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.types.some((type) =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedFilter !== "All") {
      filtered = filtered.filter((restaurant) =>
        restaurant.types.some((type) =>
          type.toLowerCase().includes(selectedFilter.toLowerCase())
        )
      );
    }

    setResults(filtered);
  }, [searchQuery, selectedFilter]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Next <span className="text-shine">Favorite Meal</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Discover amazing restaurants and cuisines in your area
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative glass flex-1">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-5 text-lg shadow-card"
              />
            </div>
            <BukkaButton variant="hero" size="lg" className="md:px-8">
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </BukkaButton>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <BukkaButton
                key={filter}
                variant={selectedFilter === filter ? "hero" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="hover-scale"
              >
                {filter}
              </BukkaButton>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <FilterDialog
              onFiltersChange={(filters) => console.log("Filters:", filters)}
            >
              <BukkaButton variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </BukkaButton>
            </FilterDialog>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex bg-muted rounded-lg p-1">
              <BukkaButton
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </BukkaButton>
              <BukkaButton
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </BukkaButton>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found{" "}
              <span className="font-semibold text-foreground">
                {results.length}
              </span>{" "}
              restaurants
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Within 5km of your location</span>
            </div>
          </div>

          {/* Restaurant Grid/List */}
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            )}
          >
            {results.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="rounded"
              >
                <RestaurantCard
                  restaurant={restaurant}
                  variant={viewMode === "list" ? "compact" : "default"}
                  onClick={() => console.log("Navigate to restaurant details")}
                />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {results.length > 0 && (
            <div className="text-center pt-8">
              <BukkaButton
                variant="outline"
                size="lg"
                onClick={() => {
                  setLoading(true);
                  // Simulate loading more restaurants
                  setTimeout(() => {
                    const moreRestaurants = [...mockRestaurants].map((r) => ({
                      ...r,
                      id: r.id + `_page${page + 1}`,
                      name: r.name + ` (Page ${page + 1})`,
                    }));
                    setResults((prev) => [...prev, ...moreRestaurants]);
                    setPage((prev) => prev + 1);
                    setLoading(false);
                  }, 1000);
                }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Restaurants"}
              </BukkaButton>
            </div>
          )}

          {/* No Results */}
          {results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-6">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">
                No restaurants found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <BukkaButton
                variant="hero"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("All");
                }}
              >
                Clear Filters
              </BukkaButton>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Search;
