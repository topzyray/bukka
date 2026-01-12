"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import {
  Grid,
  List,
  Loader2,
  Search as SearchIcon,
  TriangleAlert,
} from "lucide-react";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Input } from "@/components/ui/input";
import { BukkaButton } from "@/components/ui/button-variants";
import { useGlobalState } from "@/providers";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { useInfiniteBusinessesQuery } from "@/data/queries/use-businesses-query";
import { BusinessCard } from "./components/business-card";
import { useRouter, useSearchParams } from "next/navigation";
import { Business } from "@/data/interfaces/Business";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperFooter,
  PageWrapperHeader,
} from "@/components/ui/page-wrapper";
import { BusinessCardSkeleton } from "./components/business-card-skeleton";
import { MapSkeleton } from "../location/components/map-skeleton";
import { extractErrorMessage } from "@/utils";
import { toast } from "sonner";

const MapSelector = dynamic(
  () => import("@/features/location/map-selector").then((m) => m.MapSelector),
  {
    ssr: false,
  }
);

export function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { coordinates, setCoordinates } = useGlobalState();

  const initialSearch = searchParams.get("search") || "";

  const [q, setQ] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const PAGE_SIZE = 10;

  // debounce query updates
  const [debouncedQ, setDebouncedQ] = useState(q);
  const debouncer = useRef(
    debounce((val: string) => setDebouncedQ(val), 250)
  ).current;

  useEffect(() => () => debouncer.cancel(), [debouncer]);

  const onQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
    debouncer(e.target.value);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("search", debouncedQ);

    router.push(`/explore${params.toString() ? `?${params}` : ""}`);
  }, [debouncedQ, router]);

  // Build filters using coordinates if available
  const filters = useMemo(() => {
    const base: any = {
      search: debouncedQ || undefined,
      pageSize: PAGE_SIZE,
      sort: "distance",
      enable: true,
    };
    if (coordinates?.lat && coordinates?.lng) {
      base.lat = coordinates.lat;
      base.lng = coordinates.lng;
      base.radiusKm = 10;
    }
    return base;
  }, [debouncedQ, coordinates]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBusinessesQuery({ ...filters });

  const businesses: Business[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [debouncedQ]);

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

  // Create a lightweight businesses shape for the map (min fields required by LocationIQMap)
  const businessesForMap = useMemo(
    () =>
      businesses.map((b: Business) => ({
        id: b.id,
        name: b.name,
        location: {
          latitude: b.location?.latitude,
          longitude: b.location?.longitude,
          address: b.location?.address,
        },
        type: b.type,
      })),
    [businesses]
  );

  // programmatically center map by updating a `mapCenter` state prop passed to LocationIQMap
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(
    coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : null
  );

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng)
      setMapCenter({ lat: coordinates.lat, lng: coordinates.lng });
  }, [coordinates]);

  const handleListClick = (b: Business) => {
    if (b.location?.latitude && b.location?.longitude) {
      setMapCenter({ lat: b.location.latitude, lng: b.location.longitude });
      setSelectedId(b.id);
    }
  };

  const onSelectBusinessFromMap = (id: number) => {
    setSelectedId(id);
    const el = document.querySelector(`[data-business-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load businesses", {
        description: "Please check your connection or try again later.",
      });
    }
  }, [isError]);

  return (
    <PageWrapper>
      <PageWrapperHeader className="sticky top-0 backdrop-blur z-50">
        <Header />
      </PageWrapperHeader>
      <PageWrapperContent className="bg-gradient-subtle">
        <PageWrapperContentWithFramer>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar: search + filters + list */}
            <aside className="lg:w-2/3 space-y-4">
              <div className="sticky top-6">
                <div className="mb-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-shine">
                    Explore
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Discover nearby food businesses
                  </p>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value={q}
                      onChange={onQChange}
                      placeholder="Search businesses, cuisines or services..."
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-1">
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
                <div className="space-y-3">
                  {isLoading && (
                    <ScrollArea className="h-132">
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0.5">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <BusinessCardSkeleton key={i} />
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {isError && (
                    <div className="text-center py-16">
                      <div className="flex justify-center items-center">
                        <TriangleAlert
                          size={55}
                          className="mb-6 text-destructive"
                        />
                      </div>

                      <h3 className="text-xl font-semibold mb-2 text-destructive">
                        Oops!{" "}
                        {extractErrorMessage(error) ?? "Something went wrong."}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        We couldn’t load businesses at the moment. Please try
                        again later.
                      </p>
                      <BukkaButton variant="hero" onClick={() => refetch()}>
                        Retry
                      </BukkaButton>
                    </div>
                  )}

                  <ScrollArea className="h-144">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0.5">
                      {!isLoading &&
                        !isError &&
                        businesses.map((b: Business) => (
                          <BusinessCard
                            business={b}
                            variant={
                              viewMode === "list" ? "compact" : "default"
                            }
                            key={b.id}
                            data-business-id={b.id}
                            onClick={() => handleListClick(b)}
                            className={cn(
                              "cursor-pointer w-full rounded-xl sm:max-w-88 gap-4  shadow-card hover:shadow-elegant",
                              selectedId === b.id
                                ? "ring-1 ring-primary rounded-xl"
                                : ""
                            )}
                          />
                        ))}

                      {isFetchingNextPage && (
                        <div className="flex justify-center items-center py-8">
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-10 h-10 lg:w-16 lg:h-16 animate-spin text-muted-foreground" />
                            <span className="animate-pulse lg:text-lg">
                              Loading more...
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Infinite Scroll Sentinel */}
                      <div ref={observerRef} className="h-0" />

                      {/* Loader */}
                      {/* {isFetchingNextPage && (
                        <div className="flex justify-center items-center py-8">
                          <span className="flex items-center gap-2">
                            <Loader2
                              size={40}
                              className="w-16 h-16 animate-spin text-muted-foreground"
                            />
                            Loading more data...
                          </span>
                        </div>
                      )} */}

                      {/* <div className="col-span-full place-content-center mx-auto">
                        <BukkaButton
                          variant="outline"
                          size="sm"
                          onClick={() => {}}
                          disabled={!hasNextPage && !isFetchingNextPage}
                        >
                          View More
                        </BukkaButton>
                      </div> */}
                    </div>
                  </ScrollArea>

                  {!isLoading && !isError && businesses.length === 0 && (
                    <div className="text-center pb-8">
                      <div className="text-6xl mb-6">🍽️</div>
                      <h3 className="text-xl font-semibold mb-2">
                        No businesses found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters or check the map to discover
                        more.
                      </p>
                      <BukkaButton
                        variant="hero"
                        onClick={() => {
                          setQ("");
                        }}
                      >
                        Clear Filters
                      </BukkaButton>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Map area */}
            <section className="flex-1 rounded-lg overflow-hidden ">
              {isLoading && (
                <div
                  style={{ height: "74vh" }}
                  className="relative shadow-glow"
                >
                  <MapSkeleton height="100%" />
                </div>
              )}
              {!isLoading && !isError && businesses.length && (
                <div
                  style={{ height: "74vh" }}
                  className="relative shadow-glow"
                >
                  <MapSelector
                    initial={mapCenter}
                    onSelect={(lat: number, lng: number) => {
                      setCoordinates({ lat, lng });
                    }}
                    height="100%"
                    businesses={businessesForMap as Business[]}
                    showLegend
                    provider={MapProviderEnum.LOCATIONIQ}
                    onMarkerClick={onSelectBusinessFromMap}
                  />
                  {isFetchingNextPage && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-md flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading more...</span>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </PageWrapperContentWithFramer>
      </PageWrapperContent>
      <PageWrapperFooter>
        <Footer />
      </PageWrapperFooter>
    </PageWrapper>
  );
}
