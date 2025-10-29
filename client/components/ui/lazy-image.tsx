import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

/**
 * LazyImage: wrapper around next/image that shows a skeleton until loaded,
 * uses native lazy loading and fades image in on load.
 *
 * Props:
 *  - src: string
 *  - alt: string
 *  - width, height: numbers (pass for layout stability)
 *  - className: string (applies to image)
 *  - rounded: boolean
 */
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  rounded?: boolean;
}> = ({
  src,
  alt,
  width = 600,
  height = 400,
  className = "",
  rounded = true,
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${rounded ? "rounded-lg" : ""}`}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gray-100 dark:bg-neutral-800 animate-pulse"
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setLoaded(true)}
        loading="lazy"
        className={cn(
          className,
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        // Note: placeholder="blur" requires blurDataURL. We prefer skeleton approach for flexibility
      />
    </div>
  );
};

LazyImage.displayName = "LazyImage";
