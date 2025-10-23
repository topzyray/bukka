import { LocationModel } from "@/server/interfaces/Location";
import { LocationApiService } from "@/server/services/LocationApiService";
import { useCallback, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function LocationSearchBox({
  provider,
  mapOpen,
  onSelect,
  value,
  onChange,
  placeholder = "Search address...",
  disabled = false,
}: {
  provider: string;
  mapOpen: boolean;
  value?: string;
  onChange?: (val: string) => void;
  onSelect: (loc: LocationModel) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [results, setResults] = useState<LocationModel[]>([]);
  const [loading, setLoading] = useState(false);
  const lastQ = useRef("");
  const debounceTimer = useRef<number | null>(null);

  const doSearch = useCallback(
    async (term: string) => {
      if (!term || term.trim().length < 2) {
        setResults([]);
        return;
      }
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(async () => {
        if (lastQ.current === term) return;
        lastQ.current = term;
        setLoading(true);
        setResults([]);
        try {
          if (!mapOpen) {
            const response = await LocationApiService.searchPlaces({ term });
            setResults(response?.data ?? []);
          } else {
            try {
              const response = await LocationApiService.getLocations({
                provider,
                term,
              });
              setResults(response ?? []);
            } catch (err) {
              const response = await LocationApiService.searchPlaces({ term });
              setResults(response ?? []);
            }
          }
        } catch (err) {
          console.error("Search error", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300) as unknown as number;
    },
    [mapOpen, provider]
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") void doSearch(value ?? "");
          }}
        />
        <Button
          type="button"
          onClick={() => void doSearch(value ?? "")}
          disabled={disabled}
        >
          Search
        </Button>
      </div>

      <div>
        {loading && (
          <div className="text-sm text-muted-foreground">Searching...</div>
        )}
        {!loading && results.length > 0 && (
          <div className="border rounded-md overflow-hidden bg-background">
            {results.map((r, i) => (
              <div
                key={`${r.placeId ?? r.latitude}-${r.longitude}-${i}`}
                className="p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelect(r)}
              >
                <div className="text-sm font-medium">
                  {r.address ?? `${r.latitude}, ${r.longitude}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.source ?? "database"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { debounce } from "@/utils";
// import React, { useState, useEffect, useRef } from "react";
// // import { debounce } from "lodash";

// type Props = {
//   apiKey?: string;
//   value?: string;
//   onSelect: (coords: { lat: number; lng: number }, address: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
// };

// type LocationIQPlace = {
//   display_name: string;
//   lat: string;
//   lng: string;
// };

// export function LocationSearchBox({
//   apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN!,
//   value = "",
//   onSelect,
//   placeholder = "Search for a location...",
//   disabled = false,
//   className = "",
// }: Props) {
//   const [query, setQuery] = useState(value);
//   const [results, setResults] = useState<LocationIQPlace[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const controllerRef = useRef<AbortController | null>(null);

//   // Debounced search function
//   const fetchSuggestions = debounce(async (text: string) => {
//     if (!text || !apiKey) return;

//     if (controllerRef.current) controllerRef.current.abort();
//     const controller = new AbortController();
//     controllerRef.current = controller;

//     try {
//       setIsLoading(true);
//       const res = await fetch(
//         `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(
//           text
//         )}&limit=5&dedupe=1&normalizeaddress=1`,
//         { signal: controller.signal }
//       );

//       if (!res.ok) throw new Error("Failed to fetch suggestions");
//       const data = await res.json();
//       setResults(data);
//     } catch (err) {
//       if ((err as any).name !== "AbortError") console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, 400);

//   useEffect(() => {
//     if (query.trim().length > 2) {
//       fetchSuggestions(query);
//     } else {
//       setResults([]);
//     }
//   }, [query]);

//   const handleSelect = (place: LocationIQPlace) => {
//     const lat = parseFloat(place.lat);
//     const lng = parseFloat(place.lng);
//     setQuery(place.display_name);
//     setShowResults(false);
//     onSelect({ lat, lng }, place.display_name);
//   };

//   return (
//     <div className={`relative w-full ${className}`}>
//       <input
//         type="text"
//         value={query}
//         disabled={disabled}
//         onChange={(e) => setQuery(e.target.value)}
//         onFocus={() => setShowResults(true)}
//         placeholder={placeholder}
//         className="w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
//       />

//       {isLoading && (
//         <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
//           Loading...
//         </div>
//       )}

//       {showResults && results.length > 0 && (
//         <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 backdrop-blur-3xl shadow-md">
//           {results.map((place, idx) => (
//             <li
//               key={idx}
//               className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
//               onClick={() => handleSelect(place)}
//             >
//               {place.display_name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export function LocationSearchBox({
//   provider,
//   mapOpen,
//   onSelect,
//   placeholder = "Search address...",
//   disabled = false,
// }: {
//   provider: string;
//   mapOpen: boolean;
//   onSelect: (loc: LocationModel) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }) {
//   const [q, setQ] = useState("");
//   const [results, setResults] = useState<LocationModel[]>([]);
//   const [loading, setLoading] = useState(false);
//   const lastQ = useRef("");
//   const debounceTimer = useRef<number | null>(null);

//   console.log("LOCATION MODELs: ", results);

//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
//     };
//   }, []);

//   const doSearch = useCallback(
//     async (term: string) => {
//       if (!term || term.trim().length < 2) {
//         setResults([]);
//         return;
//       }
//       // debounce
//       if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
//       debounceTimer.current = window.setTimeout(async () => {
//         if (lastQ.current === term) return;
//         lastQ.current = term;
//         setLoading(true);
//         setResults([]);
//         try {
//           if (!mapOpen) {
//             // map closed => search backend DB
//             const response = await LocationApiService.searchPlaces({ term });
//             setResults(response?.data ?? []);
//           } else {
//             // map open => prefer provider-specific search via backend provider-search endpoint
//             try {
//               const response = await LocationApiService.reverseGeocode({
//                 provider,
//                 term,
//               });
//               // Expecting array of LocationModel
//               setResults(response ?? []);
//             } catch (err) {
//               // fallback to DB search
//               const response = await LocationApiService.searchPlaces({ term });
//               setResults(response ?? []);
//             }
//           }
//         } catch (err) {
//           console.error("Search error", err);
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       }, 300) as unknown as number;
//     },
//     [mapOpen, provider]
//   );
//   return (
//     <div className="space-y-2">
//       <div className="flex gap-2">
//         <Input
//           value={q}
//           placeholder={placeholder}
//           onChange={(e) => setQ(e.target.value)}
//           disabled={disabled}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") void doSearch(q);
//           }}
//         />
//         <Button
//           type="button"
//           onClick={() => void doSearch(q)}
//           disabled={disabled}
//         >
//           Search
//         </Button>
//       </div>

//       <div>
//         {loading && (
//           <div className="text-sm text-muted-foreground">Searching...</div>
//         )}
//         {!loading && results.length > 0 && (
//           <div className="border rounded-md overflow-hidden bg-background">
//             {results.map((r, i) => (
//               <div
//                 key={`${r.placeId ?? r.latitude}-${r.longitude}-${i}`}
//                 className="p-3 hover:bg-muted/50 cursor-pointer"
//                 onClick={() => onSelect(r)}
//               >
//                 <div className="text-sm font-medium">
//                   {r.address ?? `${r.latitude}, ${r.longitude}`}
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   {r.source ?? "database"}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
