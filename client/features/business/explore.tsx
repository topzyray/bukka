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
  AlertTriangle,
  Grid,
  List,
  Loader2,
  Search as SearchIcon,
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
import { CircularLoader } from "@/components/loaders/circular-loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperFooter,
  PageWrapperHeader,
} from "@/components/ui/page-wrapper";

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
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [q, setQ] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const PAGE_SIZE = 6;

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
    if (page > 1) params.set("page", String(page));

    router.push(`/explore${params.toString() ? `?${params}` : ""}`);
  }, [debouncedQ, page, router]);

  // Build filters using coordinates if available
  const filters = useMemo(() => {
    const base: any = {
      search: debouncedQ || undefined,
      page,
      pageSize: PAGE_SIZE,
      sort: "distance",
    };
    if (coordinates?.lat && coordinates?.lng) {
      base.lat = coordinates.lat;
      base.lng = coordinates.lng;
      base.radiusKm = 10;
    }
    return base;
  }, [debouncedQ, coordinates, page]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBusinessesQuery({ ...filters });

  const findPage = useCallback(
    (pn: number) => {
      return data?.pages?.find((p) => p.pageNumber === pn)?.data ?? [];
    },
    [data?.pages]
  );

  const goToPage = async (pn: number) => {
    console.log("PAGE NUMBER: ", pn);

    if (pn <= 0) return;
    if (findPage(pn).length > 0) {
      setPage(pn);
      return;
    }
    let safety = 0;
    while (!findPage(pn) && safety < 20) {
      await fetchNextPage();
      safety++;
      const last = data?.pages?.[data.pages.length - 1];
      if (last && last.pageNumber >= pn) break;
    }
    setPage(
      findPage(pn).length
        ? pn
        : data?.pages?.[data.pages.length - 1]?.pageNumber ?? 1
    );
  };

  const businesses: Business[] = React.useMemo(
    () => findPage(page),
    [page, findPage]
  );

  const totalRecords = data?.pages?.[0]?.totalRecords ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

  // Create a lightweight businesses shape for the map (min fields required by LocationIQMap)
  const businessesForMap = useMemo(
    () =>
      businesses.map((b: any) => ({
        id: b.id,
        name: b.name,
        location: {
          latitude: b.location?.latitude ?? 0,
          longitude: b.location?.longitude ?? 0,
          address: b.location?.address ?? "",
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

  const handleListClick = (b: any) => {
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
                    <div className="h-[50vh] flex justify-center items-center">
                      <CircularLoader text="Loading Data..." />
                    </div>
                  )}

                  {isError && (
                    <div className="flex items-center text-destructive gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Failed to load businesses.</span>
                    </div>
                  )}

                  <ScrollArea className="h-[33rem]">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0.5">
                      {!isLoading &&
                        !isError &&
                        businesses.map((b: any) => (
                          <BusinessCard
                            business={b}
                            variant={
                              viewMode === "list" ? "compact" : "default"
                            }
                            key={b.id}
                            data-business-id={b.id}
                            onClick={() => handleListClick(b)}
                            className={cn(
                              "cursor-pointer w-full rounded-xl sm:max-w-[22rem] gap-4  shadow-card hover:shadow-elegant",
                              selectedId === b.id
                                ? "ring-1 ring-primary rounded-xl"
                                : ""
                            )}
                          />
                        ))}
                    </div>
                  </ScrollArea>

                  {!isLoading && !isError && businesses.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      No businesses found nearby.
                    </div>
                  )}
                </div>

                {/* Simple pagination controls */}
                <div className="flex justify-center mt-4 gap-2">
                  <BukkaButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      goToPage(Math.min(1, page - 1));
                    }} // onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </BukkaButton>
                  <div className="flex items-center px-3 text-sm">{page}</div>
                  <BukkaButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      goToPage(Math.min(totalPages, page + 1));
                    }}
                    disabled={!hasNextPage && !isFetchingNextPage}
                  >
                    Next
                  </BukkaButton>
                </div>
              </div>
            </aside>

            {/* Map area */}
            <section className="flex-1 rounded-lg overflow-hidden ">
              {isLoading && (
                <div className="h-[80vh] flex justify-center items-center border shadow-glow">
                  <CircularLoader text="Loading Map..." />
                </div>
              )}
              {!isLoading && !isError && businesses.length && (
                <div
                  style={{ height: "72vh" }}
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
