"use client";

import { UserApiService } from "@/server/services";
import { useCustomQuery } from "./base";

export const useCurrentUser = () => {
  return useCustomQuery(
    ["currentUser"],
    () => UserApiService.getLoggedInUser(),
    {
      enabled: true,
      staleTime: 1000 * 60 * 5,
      // refetchInterval: 1000 * 60 * 10, // This can polling and can waste resources
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      placeholderData: (prev) => prev,
    }
  );
};

// "use client";

// import { UserApiService } from "@/server/services";
// import { useCustomQuery } from "./base";
// import { usePathname } from "next/navigation";
// import React from "react";

// export const useCurrentUser = () => {
//   const pathname = usePathname();

//   const allowedPathPatterns = React.useMemo(
//     () => [
//       /^\/signin$/,
//       /^\/signup$/,
//       /^\/confirm-email$/,
//       /^\/forgot-password$/,
//       /^\/reset-password$/,
//       /^\/request-email-verification$/,
//       /^\/onboarding(\/.*)?$/,
//       /^\/dashboard(\/.*)?$/,
//     ],
//     []
//   );

//   const [hydrated, setHydrated] = React.useState(false);
//   React.useEffect(() => {
//     setHydrated(true);
//   }, []);

//   const isAllowed = React.useMemo(() => {
//     try {
//       return allowedPathPatterns.some((regex) => regex.test(pathname ?? "/"));
//     } catch {
//       return false;
//     }
//   }, [pathname, allowedPathPatterns]);

//   const query = useCustomQuery(
//     ["currentUser"],
//     () => UserApiService.getLoggedInUser(),
//     {
//       enabled: false, // start disabled to avoid SSR/client mismatch
//       staleTime: 1000 * 60 * 5,
//       refetchInterval: 1000 * 60 * 10,
//       refetchOnWindowFocus: true,
//       refetchOnReconnect: true,
//       placeholderData: (prev) => prev, // if your react-query supports it; or placeholderData in v5
//     }
//   );

//   React.useEffect(() => {
//     if (!hydrated) return;
//     if (!isAllowed) return;

//     // If we already have data, you may want to skip refetch; otherwise fetch.
//     // `query.data` could be present from cache; we still call refetch to ensure up-to-date.
//     query.refetch().catch(() => {
//       // swallow — callers will handle isError
//     });

//     // also listen for visibility change: when tab becomes visible, refetch if allowed
//     const onVisibility = () => {
//       if (document.visibilityState === "visible" && isAllowed) {
//         query.refetch().catch(() => {});
//       }
//     };
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => document.removeEventListener("visibilitychange", onVisibility);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [hydrated, isAllowed]);

//   return query;
// };
