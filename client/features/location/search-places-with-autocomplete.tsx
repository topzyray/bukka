"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { SearchBox } from "@/components/ui/search-box";
import { useAutoComplete } from "@/data/queries";
import { debounce, extractErrorMessage } from "@/utils";
import { cn } from "@/lib/utils";
import { useGlobalState } from "@/providers";

interface FormValues {
  search: string;
}

export function SearchPlacesWithAutocomplete({
  onSelectLocation,
}: {
  onSelectLocation?: (lat: number, lng: number) => void;
}) {
  const form = useForm<FormValues>({ defaultValues: { search: "" } });
  const [query, setQuery] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { setCoordinates } = useGlobalState();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: suggestions = [],
    isFetching,
    isError,
    error,
  } = useAutoComplete(query);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((val: string) => {
        setQuery(val);
      }, 300),
    []
  );

  function handleSearchInput(q: string) {
    form.setValue("search", q);
    debouncedSetQuery(q);
    if (q.trim().length >= 2) setPopoverOpen(true);
    else setPopoverOpen(false);
  }

  function handleSelect(value: string, lat: string, lon: string) {
    form.setValue("search", value);
    setQuery(value);
    setPopoverOpen(false);
    setCoordinates({
      lat: Number.parseFloat(lat),
      lng: Number.parseFloat(lon),
      address: value,
    });
    onSelectLocation?.(Number.parseFloat(lat), Number.parseFloat(lon));
  }

  // Simulated submit handler
  function handleManualSubmit() {
    const data = form.getValues();
    console.log("Submitted search:", data);
    setPopoverOpen(false);
  }

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setPopoverOpen(false);
      if (e.key === "Enter") {
        e.preventDefault();
        handleManualSubmit();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col gap-0.5 bg-white dark:bg-background"
    >
      <div className="bg-background rounded-lg h-10 sm:h-12">
        <SearchBox
          {...form.register("search")}
          placeholder="Search location…"
          onSearch={handleSearchInput}
          delay={400}
          className="w-full"
          onFocus={() => {
            if (query.trim().length >= 2) setPopoverOpen(true);
          }}
        />
      </div>

      {popoverOpen && (
        <div
          className={cn(
            "w-full max-w-sm bg-background border rounded-md shadow-md"
          )}
        >
          <div className="relative w-full">
            {isFetching && (
              <div className="p-8 flex flex-col justify-center items-center">
                <Loader className="animate-spin h-8 w-8" />
                <span className="text-sm animate-pulse">Loading Data</span>
              </div>
            )}

            <ul className="m-0 w-full max-h-60 overflow-auto divide-y rounded-md">
              {query.trim().length < 2 ? (
                <li className="p-4 text-sm">Type at least 2 characters…</li>
              ) : isError ? (
                <li className="p-4 text-red-500">
                  {extractErrorMessage(error)}
                </li>
              ) : suggestions.length === 0 && !isFetching ? (
                <li className="p-4 text-sm">No results found</li>
              ) : (
                suggestions.map((s, idx) => (
                  <li
                    key={`${s.display_name}-${idx}`}
                    className="p-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault(); // keep focus on input
                      handleSelect(s.display_name, s.lat, s.lon);
                    }}
                  >
                    {s.display_name}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
