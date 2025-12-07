"use client";

import { LocationModel } from "@/data/interfaces/Location";
import { LocationApiService } from "@/data/services/LocationApiService";
import { useRef, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapSelector } from "./map-selector";
import { MapProviderEnum } from "@/data/enums/MapProviderEnum";
import { toast } from "sonner";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useGlobalState, useUserLocation } from "@/providers";

interface ILocationInput {
  control?: any;
  formName?: string;
  value?: LocationModel | null;
  onChange?: (loc: LocationModel | null) => void;
  provider: MapProviderEnum;
  useReverseGeocode?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  height?: number | string;
}

export function LocationInput({
  control,
  formName = "location",
  provider,
  useReverseGeocode,
  className,
  height = 360,
}: ILocationInput) {
  const [mapOpen, setMapOpen] = useState(false);
  const [loadingReverse, setLoadingReverse] = useState(false);
  const lastCoordsRef = useRef<string | null>(null);
  const { setCoordinates } = useGlobalState();
  const {
    userCoordinates,
    loading: loadingUserLocation,
    error: userCoordinatesError,
    refreshUserLocation,
  } = useUserLocation();

  return (
    <FormField
      control={control}
      name={formName}
      render={({ field }) => {
        const selected = field.value as LocationModel | null;

        const handleEmit = async (loc: LocationModel | null) => {
          field.onChange(loc);
        };

        const handleCoordsSelected = async (lat: number, lng: number) => {
          const coordKey = `${lat.toFixed(7)},${lng.toFixed(7)}`;

          // If reverse geocode is enabled, use it — otherwise emit manual coords
          if (useReverseGeocode) {
            // guard against duplicate reverse calls
            if (lastCoordsRef.current === coordKey) return;
            lastCoordsRef.current = coordKey;

            setLoadingReverse(true);
            try {
              const data = await LocationApiService.reverseGeocode({
                lat,
                lng,
              });

              const loc: LocationModel = {
                latitude: Number(lat),
                longitude: Number(lng),
                address:
                  data.address ?? data.formatted_address ?? data.display_name,
                placeId: data.placeId ?? data.place_id,
                city: data.city ?? data.town ?? data.village,
                state: data.state ?? data.region,
                country: data.country,
                zipCode: data.postcode ?? data.zipCode,
                source: data.source ?? provider ?? "database",
              };

              await handleEmit(loc);
            } catch {
              // If reverse fails, still emit coords so UI updates
              await handleEmit({
                latitude: lat,
                longitude: lng,
                source: "manual",
              } as LocationModel);
            } finally {
              setLoadingReverse(false);
            }
          } else {
            // no reverse geocode configured — just emit coordinates
            await handleEmit({
              latitude: lat,
              longitude: lng,
              source: "manual",
            } as LocationModel);
          }
        };

        const initialLatLng =
          selected && selected.latitude && selected.longitude
            ? { lat: selected.latitude, lng: selected.longitude }
            : undefined;

        return (
          <FormItem className={cn(className)}>
            <FormLabel>Location</FormLabel>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMapOpen((s) => !s)}
                >
                  {mapOpen ? "Hide map" : "Show map"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    if (userCoordinatesError) {
                      toast.error("Error fetching location", {
                        description: userCoordinatesError,
                      });
                      return;
                    }

                    if (userCoordinates) {
                      setCoordinates(userCoordinates);
                      void handleCoordsSelected(
                        userCoordinates.lat,
                        userCoordinates.lng
                      );
                      toast.success("Location selected");
                      return;
                    }

                    refreshUserLocation();
                  }}
                >
                  {loadingUserLocation ? "Fetching..." : "Use my location"}
                </Button>
              </div>

              {mapOpen && (
                <div style={{ height }} className="w-full">
                  <MapSelector
                    provider={provider}
                    onSelect={async (lat, lng) =>
                      await handleCoordsSelected(lat, lng)
                    }
                    initial={initialLatLng}
                    height={height}
                  />
                </div>
              )}

              <Card className="p-3 rounded-lg shadow-none">
                <ScrollArea className="max-h-40">
                  <div>
                    {loadingReverse ? (
                      <CircularLoader text="Fetching address..." />
                    ) : selected ? (
                      <>
                        {selected?.address && (
                          <div className="font-medium text-sm">
                            {selected?.address}
                          </div>
                        )}
                        {selected?.latitude && selected?.longitude && (
                          <div className="font-medium text-sm">
                            {`${selected?.latitude}, ${selected?.longitude}`}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Lat: {selected?.latitude} | Lng: {selected?.longitude}
                        </div>
                        {selected.city && (
                          <div className="text-xs">{selected.city}</div>
                        )}
                        {selected.country && (
                          <div className="text-xs">{selected.country}</div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No location selected
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
