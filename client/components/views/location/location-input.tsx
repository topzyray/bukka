"use client";

import { LocationModel } from "@/server/interfaces/Location";
import { LocationApiService } from "@/server/services/LocationApiService";
import { useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import { MapSelector } from "./map-selector";
import { MapProviderEnum } from "@/server/enums/MapProviderEnum";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils";
import { CircularLoader } from "../../loaders/circular-loader";
import { useGlobalState } from "@/providers";

type Props = {
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
};

export function LocationInput({
  control,
  formName = "location",
  provider,
  useReverseGeocode,
  className,
  height = 360,
}: // placeholder = "Search address or pick on map",
// disabled = false,
Props) {
  const [mapOpen, setMapOpen] = useState(false);
  const [loadingReverse, setLoadingReverse] = useState(false);
  const lastCoordsRef = useRef<string | null>(null);
  const { setCoordinates } = useGlobalState();

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
          const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;

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
                {/* <LocationSearchBox
                  provider={provider as string}
                  mapOpen={mapOpen}
                  value={selected?.address ?? ""}
                  onChange={(val) =>
                    handleEmit({
                      ...selected,
                      address: val,
                      source: selected?.source ?? "manual",
                    } as LocationModel)
                  }
                  onSelect={async (loc) => {
                    // --- IMPORTANT: non-blocking reverse geocode on search select ---
                    // 1) immediately update the form & UI so the map recenters right away
                    await handleEmit(loc);

                    // 2) if we need reverse-geocode, trigger it but DO NOT await it
                    //    (this prevents blocking UI while reverse runs)
                    if (loc.latitude && loc.longitude && useReverseGeocode) {
                      void handleCoordsSelected(loc.latitude, loc.longitude);
                    }
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                /> */}

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
                    if (!navigator.geolocation) {
                      toast.error("Geolocation not supported");
                      return;
                    }

                    // Request current position — update immediately and then trigger reverse geocode non-blocking.
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        console.log("COORDS: ", pos);

                        const { latitude, longitude } = pos.coords;
                        setCoordinates({
                          lng: longitude,
                          lat: latitude,
                        });
                        // non-blocking: call handleCoordsSelected but do not await it
                        void handleCoordsSelected(latitude, longitude);
                      },
                      (err) => {
                        toast.error(extractErrorMessage(err));
                      },
                      { enableHighAccuracy: true }
                    );
                  }}
                >
                  Use my location
                </Button>
              </div>

              {mapOpen && (
                <div style={{ height }} className="w-full">
                  <MapSelector
                    provider={provider}
                    onSelect={async (lat, lng) =>
                      // When map emits coordinates, we DO await here so the map selection flow
                      // waits for reverse-geocode and updates the form before proceeding.
                      // (This is okay because map interactions are user-initiated and UX expects the card to show the resolved address.)
                      // NOTE: We still guard against duplicates inside handleCoordsSelected.
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
                          Lat: {selected?.latitude?.toFixed?.(6)} | Lng:{" "}
                          {selected?.longitude?.toFixed?.(6)}
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

// "use client";

// import { LocationModel } from "@/server/interfaces/Location";
// import { LocationApiService } from "@/server/services/LocationApiService";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
// import { cn } from "@/lib/utils";
// import { LocationSearchBox } from "./location-search-box";
// import { Button } from "../ui/button";
// import { Card } from "../ui/card";
// import { ScrollArea } from "../ui/scroll-area";
// import { MapSelector } from "./map-selector";
// import { MapProviderEnum } from "@/server/enums/MapProviderEnum";

// type Props = {
//   control?: any;
//   formName?: string;
//   value?: LocationModel | null;
//   onChange?: (loc: LocationModel | null) => void;
//   provider: MapProviderEnum;
//   useReverseGeocode?: boolean;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
//   height?: number | string;
// };

// export function LocationInput({
//   control,
//   formName = "location",
//   provider,
//   useReverseGeocode,
//   placeholder = "Search address or pick on map",
//   disabled = false,
//   className,
//   height = 360,
// }: Props) {
//   const [mapOpen, setMapOpen] = useState(false);
//   const [loadingReverse, setLoadingReverse] = useState(false);
//   const lastCoordsRef = useRef<string | null>(null);

//   return (
//     <FormField
//       control={control}
//       name={formName}
//       render={({ field }) => {
//         const selected = field.value as LocationModel | null;

//         const handleEmit = async (loc: LocationModel | null) => {
//           field.onChange(loc);
//         };

//         const handleCoordsSelected = async (lat: number, lng: number) => {
//           const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
//           if (useReverseGeocode) {
//             if (lastCoordsRef.current === coordKey) return;
//             lastCoordsRef.current = coordKey;
//             setLoadingReverse(true);
//             try {
//               const data = await LocationApiService.reverseGeocode({
//                 lat,
//                 lng,
//               });
//               const loc: LocationModel = {
//                 latitude: Number(lat),
//                 longitude: Number(lng),
//                 address:
//                   data.address ?? data.formatted_address ?? data.display_name,
//                 placeId: data.placeId ?? data.place_id,
//                 city: data.city ?? data.town ?? data.village,
//                 state: data.state ?? data.region,
//                 country: data.country,
//                 zipCode: data.postcode ?? data.zipCode,
//                 source: data.source ?? provider ?? "database",
//               };
//               await handleEmit(loc);
//             } catch {
//               await handleEmit({
//                 latitude: lat,
//                 longitude: lng,
//                 source: "manual",
//               });
//             } finally {
//               setLoadingReverse(false);
//             }
//           } else {
//             await handleEmit({
//               latitude: lat,
//               longitude: lng,
//               source: "manual",
//             });
//           }
//         };

//         const initialLatLng =
//           selected && selected.latitude && selected.longitude
//             ? { lat: selected.latitude, lng: selected.longitude }
//             : undefined;

//         return (
//           <FormItem className={cn("space-y-3", className)}>
//             <FormLabel>Location</FormLabel>

//             <div className="flex flex-col gap-3">
//               <div className="flex flex-wrap gap-2">
//                 <LocationSearchBox
//                   provider={provider as string}
//                   mapOpen={mapOpen}
//                   value={selected?.address ?? ""}
//                   onChange={(val) =>
//                     handleEmit({
//                       ...selected,
//                       address: val,
//                       source: selected?.source ?? "manual",
//                     })
//                   }
//                   onSelect={async (loc) => {
//                     await handleEmit(loc);
//                     if (loc.latitude && loc.longitude && useReverseGeocode) {
//                       await handleCoordsSelected(loc.latitude, loc.longitude);
//                     }
//                   }}
//                   placeholder={placeholder}
//                   disabled={disabled}
//                 />

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setMapOpen((s) => !s)}
//                 >
//                   {mapOpen ? "Hide map" : "Show map"}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={async () => {
//                     if (!navigator.geolocation) {
//                       console.error("Geolocation not supported");
//                       return;
//                     }
//                     const pos = await new Promise<GeolocationPosition>(
//                       (resolve, reject) =>
//                         navigator.geolocation.getCurrentPosition(
//                           resolve,
//                           reject
//                         )
//                     );
//                     const { latitude, longitude } = pos.coords;
//                     await handleCoordsSelected(latitude, longitude);
//                   }}
//                 >
//                   Use my location
//                 </Button>
//               </div>

//               {mapOpen && (
//                 <div style={{ height }} className="w-full">
//                   <MapSelector
//                     provider={provider}
//                     onSelect={async (lat, lng) =>
//                       handleCoordsSelected(lat, lng)
//                     }
//                     initial={initialLatLng}
//                     height={height}
//                   />
//                 </div>
//               )}

//               <Card className="p-3 rounded-lg shadow-none">
//                 <ScrollArea className="max-h-40">
//                   <div>
//                     {loadingReverse ? (
//                       <p className="text-sm text-muted-foreground">
//                         Fetching address...
//                       </p>
//                     ) : selected ? (
//                       <>
//                         <div className="font-medium text-sm">
//                           {selected.address ??
//                             `${selected.latitude}, ${selected.longitude}`}
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           Lat: {selected.latitude?.toFixed?.(6)} | Lng:{" "}
//                           {selected.longitude?.toFixed?.(6)}
//                         </div>
//                         {selected.city && (
//                           <div className="text-xs">{selected.city}</div>
//                         )}
//                         {selected.country && (
//                           <div className="text-xs">{selected.country}</div>
//                         )}
//                       </>
//                     ) : (
//                       <p className="text-sm text-muted-foreground">
//                         No location selected
//                       </p>
//                     )}
//                   </div>
//                 </ScrollArea>
//               </Card>
//             </div>

//             <FormMessage />
//           </FormItem>
//         );
//       }}
//     />
//   );
// }

// export function LocationInput({
//   control,
//   formName = "location",
//   value = null,
//   onChange,
//   provider,
//   useReverseGeocode,
//   placeholder = "Search address or pick on map",
//   disabled = false,
//   className,
//   height = 360,
// }: Props) {
//   const [mapOpen, setMapOpen] = useState(false);
//   const [selected, setSelected] = useState<LocationModel | null>(value ?? null);
//   const [loadingReverse, setLoadingReverse] = useState(false);
//   const lastCoordsRef = useRef<string | null>(null);

//   useEffect(() => setSelected(value ?? null), [value]);

//   const emitValue = useCallback(
//     async (loc: LocationModel | null) => {
//       setSelected(loc);
//       onChange?.(loc);
//     },
//     [onChange]
//   );

//   const handleCoordsSelected = useCallback(
//     async (lat: number, lng: number) => {
//       const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
//       if (useReverseGeocode) {
//         if (lastCoordsRef.current === coordKey) {
//           // already fetched
//           return;
//         }
//         lastCoordsRef.current = coordKey;
//         setLoadingReverse(true);
//         try {
//           const data = await LocationApiService.reverseGeocode({ lat, lng });
//           const loc: LocationModel = {
//             latitude: Number(lat),
//             longitude: Number(lng),
//             address:
//               data.address ?? data.formatted_address ?? data.display_name,
//             placeId: data.placeId ?? data.place_id,
//             city: data.city ?? data.town ?? data.village,
//             state: data.state ?? data.region,
//             country: data.country,
//             zipCode: data.postcode ?? data.zipCode,
//             source: data.source ?? provider ?? "database",
//             ...data,
//           };
//           await emitValue(loc);
//         } catch (err) {
//           console.log("ERROR: ", err);

//           await emitValue({ latitude: lat, longitude: lng, source: "manual" });
//         } finally {
//           setLoadingReverse(false);
//         }
//       } else {
//         await emitValue({ latitude: lat, longitude: lng, source: "manual" });
//       }
//     },
//     [emitValue, provider, useReverseGeocode]
//   );

//   const handleSearchSelect = useCallback(
//     async (loc: LocationModel) => {
//       await emitValue(loc);
//       if (loc.latitude && loc.longitude && useReverseGeocode) {
//         await handleCoordsSelected(loc.latitude, loc.longitude);
//       }
//     },
//     [emitValue, handleCoordsSelected, useReverseGeocode]
//   );

//   // useEffect(() => {
//   //   if (control && formName) {
//   //     try {
//   //       control.setValue(formName, selected ?? null);
//   //     } catch (err) {
//   //       console.log("ERROR: ", err);
//   //     }
//   //   }
//   // }, [control, formName, selected]);

//   const initialLatLng = useMemo(
//     () =>
//       selected
//         ? { lat: selected.latitude, lng: selected.longitude }
//         : undefined,
//     [selected]
//   );

//   return (
//     <FormField
//       control={control}
//       name={formName}
//       render={({ field }) => (
//         <FormItem className={cn("space-y-3", className)}>
//           <FormLabel>Location</FormLabel>

//           <div className="flex flex-col gap-3">
//             <div className="flex flex-wrap gap-2">
//               <LocationSearchBox
//                 provider={provider as string}
//                 mapOpen={mapOpen}
//                 onSelect={async (loc) => {
//                   await handleSearchSelect(loc);
//                   field.onChange(loc); // ✅ update React Hook Form
//                 }}
//                 placeholder={placeholder}
//                 disabled={disabled}
//               />

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setMapOpen((s) => !s)}
//               >
//                 {mapOpen ? "Hide map" : "Show map"}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={async () => {
//                   if (
//                     typeof navigator === "undefined" ||
//                     !navigator.geolocation
//                   ) {
//                     console.error("Geolocation not supported");
//                     return;
//                   }

//                   try {
//                     const pos = await new Promise<GeolocationPosition>(
//                       (resolve, reject) =>
//                         navigator.geolocation.getCurrentPosition(
//                           resolve,
//                           reject,
//                           {
//                             enableHighAccuracy: true,
//                             timeout: 20000,
//                             maximumAge: 0,
//                           }
//                         )
//                     );

//                     const { latitude, longitude } = pos.coords;
//                     await handleCoordsSelected(latitude, longitude);
//                     field.onChange({
//                       latitude,
//                       longitude,
//                       source: "manual",
//                     }); // ✅ update form value
//                   } catch (err) {
//                     console.error("Could not get accurate location:", err);
//                   }
//                 }}
//               >
//                 Use my location
//               </Button>
//             </div>

//             {mapOpen && (
//               <div style={{ height }} className="w-full">
//                 <MapSelector
//                   provider={provider}
//                   onSelect={async (lat, lng) => {
//                     await handleCoordsSelected(lat, lng);
//                     field.onChange({ latitude: lat, longitude: lng }); // ✅ update form value
//                   }}
//                   initial={initialLatLng ?? undefined}
//                   height={height}
//                 />
//               </div>
//             )}

//             <Card className="p-3 rounded-lg shadow-none">
//               <ScrollArea className="max-h-40">
//                 <div>
//                   {loadingReverse ? (
//                     <p className="text-sm text-muted-foreground">
//                       Fetching address...
//                     </p>
//                   ) : selected ? (
//                     <div>
//                       <div className="font-medium text-sm">
//                         {selected.address ??
//                           `${selected.latitude}, ${selected.longitude}`}
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Lat: {selected.latitude?.toFixed?.(6)} | Lng:{" "}
//                         {selected.longitude?.toFixed?.(6)}
//                       </div>
//                       {selected.city && (
//                         <div className="text-xs">{selected.city}</div>
//                       )}
//                       {selected.country && (
//                         <div className="text-xs">{selected.country}</div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-muted-foreground">
//                       No location selected
//                     </p>
//                   )}
//                 </div>
//               </ScrollArea>
//             </Card>
//           </div>

//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }

// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { LocationModel } from "@/server/interfaces/Location";
// import MapSelector from "./map-selector";
// import { LocationApiService } from "@/server/services/LocationApiService";

// type Props = {
//   label?: string;
//   value?: LocationModel | null;
//   onChange?: (loc: LocationModel | null) => void;
//   placeholder?: string;
//   renderMapPicker?: any;
// };

// export function LocationInput({
//   label = "Location",
//   value = null,
//   onChange,
//   placeholder = "Search address or pick on map",
// }: Props) {
//   const [q, setQ] = useState("");
//   const [results, setResults] = useState<LocationModel[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [mapOpen, setMapOpen] = useState(false);
//   const [selected, setSelected] = useState<LocationModel | null>(value ?? null);

//   useEffect(() => setSelected(value ?? null), [value]);

//   const doSearch = useCallback(async (term: string) => {
//     if (!term || term.trim().length < 2) {
//       setResults([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const r = await LocationApiService.searchPlaces({ term });
//       setResults(r);
//     } catch (err) {
//       console.error(err);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const chooseResult = useCallback(
//     async (item: LocationModel) => {
//       setSelected(item);
//       setResults([]);
//       setQ(item.address ?? `${item.latitude}, ${item.longitude}`);
//       onChange?.(item);
//     },
//     [onChange]
//   );

//   const handleMapSelect = useCallback(
//     async (lat: number, lng: number) => {
//       // call backend reverse geocode to get address
//       setLoading(true);
//       try {
//         console.log("LONG AND LAT", { lat, lng });

//         // const full = await LocationApiService.reverseGeocode({ lat, lng });
//         // if (full) {
//         //   setSelected(full);
//         //   setQ(full.address ?? `${lat}, ${lng}`);
//         //   onChange?.(full);
//         // } else {
//         //   const manual: LocationModel = {
//         //     latitude: lat,
//         //     longitude: lng,
//         //     address: `${lat}, ${lng}`,
//         //     source: "manual",
//         //   };
//         //   setSelected(manual);
//         //   setQ(manual.address ?? "");
//         //   onChange?.(manual);
//         // }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//         setMapOpen(false);
//       }
//     },
//     [onChange]
//   );

//   return (
//     <section className="space-y-1.5">
//       <Label>{label}</Label>
//       <Card className="rounded-lg w-full p-0">
//         <CardContent className="p-4">
//           <div className="flex flex-col md:flex-row gap-2 md:items-center w-full">
//             <Input
//               value={q}
//               placeholder={placeholder}
//               onChange={(e) => {
//                 setQ(e.target.value);
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") void doSearch(q);
//               }}
//               className="border-none outline-none"
//             />
//             <Button onClick={() => void doSearch(q)}>Search</Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setMapOpen((s) => !s)}
//             >
//               {mapOpen ? "Close Map" : "Pick on map"}
//             </Button>
//           </div>

//           <div>
//             {loading && (
//               <div className="text-sm text-muted-foreground">Searching...</div>
//             )}
//             {!loading && results.length > 0 && (
//               <div className="border rounded-md overflow-hidden">
//                 {results.map((r, i) => (
//                   <div
//                     key={`${r.placeId ?? r.latitude}-${r.longitude}-${i}`}
//                     className="p-3 hover:bg-muted/50 cursor-pointer"
//                     onClick={() => void chooseResult(r)}
//                   >
//                     <div className="text-sm font-medium">
//                       {r.address ?? `${r.latitude}, ${r.longitude}`}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       {r.source ?? ""}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {mapOpen && (
//             <div className="mt-3">
//               <MapSelector
//                 initial={
//                   selected
//                     ? { lat: selected.latitude, lng: selected.longitude }
//                     : null
//                 }
//                 onSelect={handleMapSelect}
//               />
//             </div>
//           )}

//           {selected && (
//             <div className="mt-3 border p-3 rounded-md bg-muted/10">
//               <div className="text-sm font-medium">
//                 {selected.address ?? "Selected location"}
//               </div>
//               <div className="text-xs text-muted-foreground">
//                 Lat: {selected.latitude}, Lng: {selected.longitude}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </section>
//   );
// }
