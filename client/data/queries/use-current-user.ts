"use client";

import { UserApiService } from "@/data/services";
import { useCustomQuery } from "./base";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../enums";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  const ACCESS_TOKEN_MAX_AGE = 1800000; // 30 minutes
  const query = useCustomQuery(
    [QueryKeyEnum.CURRENT_USER],
    async () => {
      try {
        return await UserApiService.getLoggedInUser();
      } catch (err: any) {
        if (err?.status === 401) {
          queryClient.setQueryData([QueryKeyEnum.CURRENT_USER], null);
        }
        throw err;
      }
    },
    {
      enabled: true,
      staleTime: ACCESS_TOKEN_MAX_AGE,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // placeholderData: (prev) => prev,
      placeholderData: () =>
        queryClient.getQueryData([QueryKeyEnum.CURRENT_USER]) || null,
    }
  );
  const isFirstLoad =
    query.isLoading &&
    queryClient.getQueryData([QueryKeyEnum.CURRENT_USER]) === undefined;
  return { ...query, isFirstLoad };
};

// "use client";

// import { UserApiService } from "@/data/services";
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
//     [QueryKeyEnum.CURRENT_USER],
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
