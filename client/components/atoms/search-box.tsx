import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { debounce } from "@/utils";
import { cn } from "@/lib/utils";

interface SearchBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Called when the user stops typing (after debounce). Will NOT fire on mount. */
  onSearch?: (query: string) => void;
  /** Debounce delay in ms (default: 600) */
  delay?: number;
  /** Override standard input onChange for React Hook Form or controlled usage */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Generic, type-safe SearchBox component.
 * - Debounced
 * - Works with react-hook-form, shadcn/ui, react-query, etc.
 * - Ignores firing on initial mount
 * - Includes a clear (×) button
 *
 * Use with react-hook-form (shadcn)
 * <FormField
 *   control={form.control}
 *   name="search"
 *   render={({ field }) => (
 *     <SearchBox
 *       {...field}
 *       placeholder="Search criteria"
 *       onSearch={(q) => console.log("Searching: ", q)}
 *     />
 *  )}
 * />
 *
 * Use with React Query
 * const { refetch } = useInfiniteQuery(...);
 *
 * <SearchBox
 *   onSearch={() => refetch()}
 *   placeholder="Search criteria..."
 *   onSearch={(q) => console.log("Searching: ", q)}
 *   delay={400}
 * />
 *
 * Use with norma form/standalone
 * const [query, setQuery] = useState("");
 *
 * <SearchBox
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   placeholder="Search criteria..."
 *   onSearch={(q) => console.log("Searching: ", q)}
 *   delay={400}
 * />
 */
export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  (
    {
      className,
      placeholder = "Search",
      onSearch,
      delay = 600,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const normalizedValue =
      typeof value === "string"
        ? value
        : typeof value === "number"
        ? String(value)
        : Array.isArray(value)
        ? value.join(", ")
        : "";

    const [internalValue, setInternalValue] = useState(normalizedValue);
    const isFirstRender = useRef(true);

    // Keep internalValue in sync with external controlled value
    useEffect(() => {
      setInternalValue(normalizedValue);
    }, [normalizedValue]);

    const debouncedSearch = useMemo(
      () =>
        debounce((query: string) => {
          if (!isFirstRender.current) {
            onSearch?.(query);
          }
        }, delay),
      [onSearch, delay]
    );

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      debouncedSearch(internalValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [internalValue]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const newVal = e.target.value;
      setInternalValue(newVal);
      onChange?.(e);
    }

    function handleClear() {
      const syntheticEvent = {
        target: { value: "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      setInternalValue("");
      onChange?.(syntheticEvent);
      onSearch?.("");
    }

    const hasValue = internalValue.trim().length > 0;

    return (
      <section className="w-full h-full relative rounded-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          ref={ref}
          placeholder={placeholder}
          value={internalValue}
          className={cn(
            "w-full h-full pl-9 pr-8 focus:border-none rounded-lg",
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </section>
    );
  }
);

SearchBox.displayName = "SearchBox";
