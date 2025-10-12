"use client";

import { UserApiService } from "@/server/services";
import { useCustomQuery } from "./base";
import { usePathname } from "next/navigation";

export const useCurrentUser = () => {
  const pathname = usePathname();
  const allowedPathPatterns = [
    /^\/signin$/,
    /^\/signup$/,
    /^\/confirm-email$/,
    /^\/forgot-password$/,
    /^\/reset-password$/,
    /^\/request-email-verification$/,
    /^\/onboarding(\/.*)?$/,
    /^\/dashboard(\/.*)?$/,
  ];
  const isAllowed = allowedPathPatterns.some((regex) => regex.test(pathname));
  return useCustomQuery(
    ["currentUser"],
    () => UserApiService.getLoggedInUser(),
    {
      enabled: isAllowed,
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );
};
