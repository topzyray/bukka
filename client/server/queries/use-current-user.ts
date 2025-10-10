"use client";

import { useEffect, useState } from "react";
import { UserApiService } from "@/server/services";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs";
import { useCustomQuery } from "./base";

export const useCurrentUser = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ✅ Read localStorage only after mount
  useEffect(() => {
    const token = StorageUtilsHelper.getItemFromLocalStorage(
      STORE_KEYS.USER_ACCESS_TOKEN
    ) as unknown as string;
    setAccessToken(token);
    setIsReady(true);
  }, []);

  const query = useCustomQuery(
    ["user"],
    () => UserApiService.getLoggedInUser(),
    {
      enabled: isReady && !!accessToken, // don't fetch until ready
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  return {
    ...query,
    isLoading: !isReady || query.isLoading, // consistent loading state
  };
};
