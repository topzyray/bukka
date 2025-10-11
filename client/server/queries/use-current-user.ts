"use client";

import { UserApiService } from "@/server/services";
import { useCustomQuery } from "./base";

export const useCurrentUser = () => {
  return useCustomQuery(
    ["currentUser"],
    () => UserApiService.getLoggedInUser(),
    {
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );
};
