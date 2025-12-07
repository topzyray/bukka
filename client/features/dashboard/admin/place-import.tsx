"use client";

import * as z from "zod";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { BukkaButton, Form, Label } from "@/components/ui";
import { usePlaceSearchQuery } from "@/data/queries/use-places-query";
import { Loader2 } from "lucide-react";
import { useCategoriesQuery } from "@/data/queries/use-businesses-category-query";
import { BusinessCategory } from "@/data/interfaces/BusinessCategory";
import { PlaceProviderEnum } from "@/data/enums/PlaceProviderEnum";
import { LocationInput } from "@/features/location/location-input";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers";
import { DataHelper } from "@/helpers";
import { BusinessImportDialog } from "./modals/business-import-modal";

const adminPlaceImportSchema = z.object({
  provider: z.enum(PlaceProviderEnum),
  // limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)),
  limit: z.coerce.number().int().min(1).max(100),
  query: z.string().optional().default(""),
  category: z.string().min(1),
  radius: z.preprocess((val) => Number(val), z.number().min(300)),
  location: z.object({
    latitude: z.preprocess((val) => Number(val), z.number().min(-90).max(90)),
    longitude: z.preprocess(
      (val) => Number(val),
      z.number().min(-180).max(180)
    ),
  }),
});

export function AdminPlaceImport() {
  const form = useForm({
    resolver: zodResolver(adminPlaceImportSchema),
    defaultValues: {
      provider: PlaceProviderEnum.GEOAPIFY,
      category: "",
      radius: 3000,
      location: {
        latitude: undefined,
        longitude: undefined,
      },
    },
  });

  const watchProvider = form.watch("provider");
  const watchQuery = form.watch("query");
  const watchCategory = form.watch("category");
  const watchLimit = form.watch("limit");
  const watchRadius = form.watch("radius");
  const watchLocation = form.watch("location");

  const lat = Number(watchLocation?.latitude);
  const lng = Number(watchLocation?.longitude);

  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  const { data: categoryApiData } = useCategoriesQuery({
    search: "",
    filters: {},
    pageSize: 20,
    enabled: true,
  });

  const categoriesData: BusinessCategory[] = useMemo(
    () => categoryApiData?.responseData?.data ?? [],
    [categoryApiData]
  );

  const {
    data: placesAPIData,
    isLoading: isLoadingPlaces,
    isFetching: isFetchingPlaces,
    isRefetching: isRefetchingPlaces,
    isError: isPlacesError,
    refetch: refetchPlaces,
  } = usePlaceSearchQuery({
    filters: {
      lng,
      lat,
      category: watchCategory,
      provider: watchProvider,
      radius: Number(watchRadius),
      limit: Number(watchLimit),
      query: watchQuery,
    },
    enabled: false,
  });

  const busy = isLoadingPlaces || isFetchingPlaces || isRefetchingPlaces;

  const results = placesAPIData?.responseData ?? [];

  const toggleSelect = (id: string) => {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelectedIds(s);
  };

  const importSelected = async () => {
    if (!watchCategory) {
      setMessage("Select internal category before importing");
      return;
    }
    if (selectedIds.size === 0) {
      setMessage("Select at least one place");
      return;
    }

    setImporting(true);
    setMessage("");

    try {
      const res = await fetch("/admin/places/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: watchProvider,
          externalIds: Array.from(selectedIds),
          categoryId: Number(watchCategory),
          importMode: "enqueue",
        }),
      });

      const payload = await res.json();
      setMessage(payload.message || "Import enqueued");
    } catch (e) {
      setMessage("Import request failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Import Business From Place</h1>
          <p className="text-sm text-muted-foreground">
            Import business from place APIs
          </p>
        </div>
      </header>

      <Form {...form}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* PROVIDER */}
              <div className="col-span-3 md:col-span-1">
                <Label className="text-sm block mb-1">Provider</Label>

                <Select
                  value={watchProvider}
                  onValueChange={(v: PlaceProviderEnum) =>
                    form.setValue("provider", v)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose provider" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={PlaceProviderEnum.GEOAPIFY}>
                      GeoApiFy Places
                    </SelectItem>
                    <SelectItem value={PlaceProviderEnum.GOOGLE}>
                      Google Places
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* INTERNAL CATEGORY */}
              <div className="col-span-3 md:col-span-1">
                <Label className="text-sm block mb-1">Internal Category</Label>
                <Select
                  value={watchCategory}
                  onValueChange={(v) => form.setValue("category", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categoriesData.map((c) => (
                      <SelectItem key={c.id} value={c.type}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* RADIUS */}
              <div className="col-span-3 md:col-span-1">
                <Label className="text-sm block mb-1">Radius (meters)</Label>

                <Input
                  type="number"
                  min={100}
                  value={watchRadius as number}
                  onChange={(e) =>
                    form.setValue("radius", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-span-3 md:col-span-1">
                <Label className="text-sm block mb-1">Limit</Label>

                <Select
                  value={watchLimit as string}
                  onValueChange={(v) => form.setValue("limit", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add limit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="70">70</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* QUERY */}
              <div className="col-span-3 md:col-span-2">
                <Label className="text-sm block mb-1">
                  Query / Keyword (optional)
                </Label>
                <Input
                  value={watchQuery}
                  onChange={(e) => form.setValue("query", e.target.value)}
                  placeholder="eg. best suya in abuja"
                />
              </div>

              {/* LOCATION INPUT */}
              <div className="space-y-2 w-full col-span-3">
                <LocationInput
                  provider={MapProviderEnum.LOCATIONIQ}
                  formName="location"
                  useReverseGeocode={false}
                  control={form.control}
                  className="w-full"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => refetchPlaces()}
                  disabled={busy || !form.formState.isValid}
                >
                  {busy ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Form>

      {/* RESULTS */}
      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Results ({results.length})
            </h3>

            {results.length && (
              <div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setSelectedIds(new Set(results.map((r) => r.externalId)))
                  }
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  className="ml-2"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {busy && (
              <span className="flex items-center gap-1.5">
                <Loader2 className="animate-spin" /> Loading...
              </span>
            )}

            {!busy &&
              !isPlacesError &&
              results.length > 0 &&
              results.map((r) => {
                const title =
                  r.name ||
                  r.raw?.properties?.address_line1 ||
                  "Unnamed Location";

                const categories = r.types?.join(", ");
                const distance = r.raw?.properties?.distance;

                return (
                  <div
                    key={r.externalId}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border rounded p-3 hover:bg-muted-foreground/10 transition"
                  >
                    <div className="w-full flex-1 flex items-start">
                      <Checkbox
                        checked={selectedIds.has(r.externalId)}
                        onCheckedChange={() => toggleSelect(r.externalId)}
                        className="mt-1 dark:border-muted-foreground"
                      />

                      <div className="ml-3 space-y-1 w-full text-sm">
                        {/* Name */}
                        <p>
                          <span className="font-semibold">Name: </span>
                          {title}
                        </p>

                        {/* Address */}
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Address:{" "}
                          </span>
                          {r.address}
                        </p>

                        {/* Location */}
                        {r.lat && (
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Location:
                            </span>{" "}
                            Lat: {r.lat} • Lng: {r.lng}
                          </p>
                        )}

                        {/* Distance */}
                        {distance && (
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Distance:{" "}
                            </span>
                            {distance} m
                          </p>
                        )}

                        {/* Categories */}
                        {categories && (
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Categories:{" "}
                            </span>
                            {categories}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <BusinessImportDialog
                        data={r?.raw?.properties}
                        categoriesData={categoriesData}
                        watchCategory={watchCategory}
                        watchProvider={watchProvider}
                      />
                    </div>
                  </div>
                );
              })}

            {!busy && !isPlacesError && results.length === 0 && (
              <div className="flex items-center border rounded p-3">
                <p>No place matches the criteria</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <BukkaButton
              onClick={importSelected}
              disabled={importing || selectedIds.size === 0}
            >
              {importing
                ? "Importing..."
                : `Import Selected (${selectedIds.size})`}
            </BukkaButton>

            <BukkaButton
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </BukkaButton>
          </div>

          {message && (
            <div className="mt-3 text-sm text-foreground">{message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
