// "use client";

// import { UserApiService } from "@/server/services";
// import { useCustomQuery } from "./base";
// import { usePathname } from "next/navigation";

// export const useCurrentUser = () => {
//   const pathname = usePathname();
//   const allowedPathPatterns = [
//     /^\/signin$/,
//     /^\/signup$/,
//     /^\/confirm-email$/,
//     /^\/forgot-password$/,
//     /^\/reset-password$/,
//     /^\/request-email-verification$/,
//     /^\/onboarding(\/.*)?$/,
//     /^\/dashboard(\/.*)?$/,
//   ];
//   const isAllowed = allowedPathPatterns.some((regex) => regex.test(pathname));
//   return useCustomQuery(
//     ["currentUser"],
//     () => UserApiService.getLoggedInUser(),
//     {
//       enabled: isAllowed,
//       staleTime: 1000 * 60 * 5,
//       refetchInterval: 1000 * 60 * 10,
//       refetchOnWindowFocus: true,
//       refetchOnReconnect: true,
//     }
//   );
// };

"use client";

import { UserApiService } from "@/server/services";
import { useCustomQuery } from "./base";
import { usePathname } from "next/navigation";
import React from "react";

/**
 * Hydration-safe, route-conditional current user hook.
 *
 * Behavior:
 * - Query is initially disabled (no SSR fetch).
 * - After client hydration, we compute `isAllowed`.
 * - If allowed, we programmatically trigger a refetch so no manual reload is required.
 * - Keeps normal react-query options for caching/refetching.
 */
export const useCurrentUser = () => {
  const pathname = usePathname();

  const allowedPathPatterns = React.useMemo(
    () => [
      /^\/signin$/,
      /^\/signup$/,
      /^\/confirm-email$/,
      /^\/forgot-password$/,
      /^\/reset-password$/,
      /^\/request-email-verification$/,
      /^\/onboarding(\/.*)?$/,
      /^\/dashboard(\/.*)?$/,
    ],
    []
  );

  // Hydration guard — ensures decisions are only made on the client
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  // Compute whether current pathname should fetch user
  const isAllowed = React.useMemo(() => {
    try {
      return allowedPathPatterns.some((regex) => regex.test(pathname ?? "/"));
    } catch {
      return false;
    }
  }, [pathname, allowedPathPatterns]);

  // Create the query but keep it disabled initially.
  // We keep automatic refetch settings — but we start `enabled: false`
  // and manually trigger when hydrated && isAllowed.
  const query = useCustomQuery(
    ["currentUser"],
    () => UserApiService.getLoggedInUser(),
    {
      enabled: false, // start disabled to avoid SSR/client mismatch
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      placeholderData: (prev) => prev, // if your react-query supports it; or placeholderData in v5
    }
  );

  // When client is hydrated and path is allowed -> trigger refetch once.
  React.useEffect(() => {
    if (!hydrated) return;
    if (!isAllowed) return;

    // If we already have data, you may want to skip refetch; otherwise fetch.
    // `query.data` could be present from cache; we still call refetch to ensure up-to-date.
    query.refetch().catch(() => {
      // swallow — callers will handle isError
    });

    // also listen for visibility change: when tab becomes visible, refetch if allowed
    const onVisibility = () => {
      if (document.visibilityState === "visible" && isAllowed) {
        query.refetch().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isAllowed]); // intentionally omit `query` to avoid effect re-run loop

  return query;
};
