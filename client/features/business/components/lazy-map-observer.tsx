import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DynamicBusinessMiniMap = dynamic(
  () => import("./business-mini-map").then((m) => m.BusinessMiniMap),
  {
    ssr: false,
    // optional: a light loading placeholder
    loading: () => (
      <div className="w-full h-56 md:h-44 lg:h-60 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800" />
    ),
  }
);

/**
 * LazyMapObserver: uses IntersectionObserver to mount DynamicBusinessMiniMap only when near viewport.
 * rootMargin defines how early to load (e.g., '300px' will pre-load before visible).
 */
export const LazyMapObserver: React.FC<{
  business: any;
  rootMargin?: string;
}> = ({ business, rootMargin = "300px" }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    let mounted = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && mounted) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className="w-full h-56 md:h-44 lg:h-60 rounded-lg overflow-hidden"
    >
      {visible ? (
        <DynamicBusinessMiniMap business={business} />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-neutral-800 animate-pulse" />
      )}
    </div>
  );
};
