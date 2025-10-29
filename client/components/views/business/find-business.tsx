"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Filter, Grid, List, Loader2 } from "lucide-react";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { BukkaButton } from "@/components/ui/button-variants";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BusinessCard } from "./components/business-card";
import { useBusinesses } from "@/server/queries/use-businesses-query";
import { Business } from "@/server/interfaces/Business";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { TypeAnimation } from "react-type-animation";
import { BusinessTypeEnum } from "@/server/enums/BusinessTypeEnum";
import { TextHelper } from "@/helpers";
import { SearchBox } from "@/components/atoms/search-box";
import { CircularLoader } from "@/components/loaders/circular-loader";

const filters = [
  "All",
  BusinessTypeEnum.RESTAURANT,
  BusinessTypeEnum.FAST_FOOD,
  BusinessTypeEnum.FOOD_VENDOR,
  BusinessTypeEnum.BAR,
  BusinessTypeEnum.BAKERY,
  BusinessTypeEnum.LOUNGE,
  BusinessTypeEnum.STREET_EATRY,
  BusinessTypeEnum.CATERING,
  BusinessTypeEnum.GROCERY,
  BusinessTypeEnum.DELIVERY_SERVICE,
  BusinessTypeEnum.OTHER,
];

export default function FindBusinessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "All";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedFilter, setSelectedFilter] = useState(initialType);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const PAGE_SIZE = 12;

  const debouncedSearch = useDebounce(searchQuery, 600);

  const updateURL = useCallback(
    (params: Record<string, string | undefined>) => {
      const query = new URLSearchParams();

      if (params.search) query.set("search", params.search);
      if (params.type && params.type !== "All")
        query.set("type", params.type.toLowerCase());

      const queryString = query.toString();
      router.push(`/businesses${queryString ? `?${queryString}` : ""}`);
    },
    [router]
  );

  useEffect(() => {
    updateURL({ search: debouncedSearch, type: selectedFilter });
  }, [debouncedSearch, selectedFilter, updateURL]);

  const filterObj = useMemo(
    () => ({
      type: selectedFilter !== "All" ? selectedFilter.toUpperCase() : undefined,
    }),
    [selectedFilter]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBusinesses({
    search: debouncedSearch,
    filters: filterObj,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const results: Business[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [debouncedSearch, selectedFilter]);

  // Observe the last element to auto-load next page
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const el = observerRef.current;
    observer.observe(el);

    return () => observer.unobserve(el);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load businesses", {
        description: "Please check your connection or try again later.",
      });
    }
  }, [isError]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto px-4 py-8 mt-0 lg:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <h1 className="text-3xl md:text-6xl font-bold mb-4">
            Find Your Next <br />
            <span className="text-shine">
              Favorite{" "}
              <TypeAnimation
                sequence={[
                  TextHelper.normalizeText(BusinessTypeEnum.RESTAURANT),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.FAST_FOOD),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.FOOD_VENDOR),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.BAR),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.LOUNGE),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.BAKERY),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.STREET_EATRY),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.GROCERY),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.CATERING),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.DELIVERY_SERVICE),
                  1500,
                  TextHelper.normalizeText(BusinessTypeEnum.OTHER) +
                    " " +
                    "Services",
                  1500,
                ]}
                wrapper="span"
                repeat={Infinity}
                className="capitalize"
              />
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Discover food-related businesses and services in your area
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto h-10 sm:h-12 lg:h-13">
            <SearchBox
              placeholder="Search businesses, cuisines, or services..."
              value={debouncedSearch}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" shadow-card"
            />
            {/* <BukkaButton variant="hero" size="lg" className="md:px-8">
              <SearchIcon className="w-5 h-5 mr-2" /> Search
            </BukkaButton> */}
          </div>
        </motion.div>

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
                className="hover-scale capitalize"
              >
                {filter.replace("_", " ").toLowerCase()}
              </BukkaButton>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <FilterDialog onFiltersChange={(f) => console.log("Filters:", f)}>
              <BukkaButton variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> More Filters
              </BukkaButton>
            </FilterDialog>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex gap-1 bg-muted rounded-lg p-1">
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found{" "}
              <span className="font-semibold text-foreground">
                {results.length}
              </span>{" "}
              businesses
            </p>
            {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Within 5km of your location</span>
            </div> */}
          </div>

          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            )}
          >
            {isLoading && (
              <div className="flex justify-center items-center mt-4 md:mt-8 w-full col-span-3">
                <CircularLoader text="Loading Data..." />
              </div>
            )}

            {!isLoading &&
              results.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <BusinessCard
                    business={b}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                </motion.div>
              ))}
          </div>

          {/* Load More (simple) */}
          {/* {hasNextPage && (
            <div className="text-center pt-8">
              <BukkaButton
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage}
              >
                Load More
              </BukkaButton>
            </div>
          )} */}

          {/* Infinite Scroll Sentinel */}
          <div ref={observerRef} className="h-10" />

          {/* Loader */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">
                Oops! Something went wrong.
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn’t load businesses at the moment. Please try again
                later.
              </p>
              <BukkaButton
                variant="hero"
                onClick={() => window.location.reload()}
              >
                Retry
              </BukkaButton>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && results.length === 0 && (
            <div className="text-center pb-8">
              <div className="text-6xl mb-6">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">
                No businesses found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or check the map to discover more.
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
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
