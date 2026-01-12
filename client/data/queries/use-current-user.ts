"use client";

import { UserApiService } from "@/data/services";
import { useCustomQuery } from "./base";
import { queryClient } from "@/lib";
import { QueryKeyEnum } from "../enums";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const storeUser = useAuthStore((state) => state.user);

  const ACCESS_TOKEN_MAX_AGE = 1800000; // 30 minutes

  const query = useCustomQuery(
    [QueryKeyEnum.CURRENT_USER],
    async () => {
      try {
        const user = await UserApiService.getLoggedInUser();
        return user;
      } catch (err: any) {
        // if (err?.status === 401) {
        //   queryClient.setQueryData([QueryKeyEnum.CURRENT_USER], null);
        // }

        // If the server says 401, remove cached value instead of setting it to null.
        // That allows the app to treat page reload as "initial boot" and wait for /me.
        if ((err as any)?.response?.status === 401) {
          // remove cached entry so initial load remains "unknown" (undefined)
          queryClient.removeQueries({
            queryKey: [QueryKeyEnum.CURRENT_USER],
            exact: true,
          });
          setUser(null);
        }
        throw Error("Error fetching user: ", err);
      }
    },
    {
      enabled: !!storeUser,
      staleTime: ACCESS_TOKEN_MAX_AGE,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      placeholderData: () =>
        queryClient.getQueryData([QueryKeyEnum.CURRENT_USER]),
    }
  );

  // Sync fetched data into Zustand
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  // const isFirstLoad =
  //   query.isLoading &&
  //   queryClient.getQueryData([QueryKeyEnum.CURRENT_USER]) === undefined;
  const isFirstLoad = query.isLoading && query.data === undefined;
  return { ...query, isFirstLoad };
};
