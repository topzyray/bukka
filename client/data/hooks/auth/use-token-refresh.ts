import { useEffect } from "react";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authRoutes } from "@/constants/routes";
import { QueryKeyEnum } from "@/data/enums";

export const useTokenRefresh = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refresh = async () => {
      const refreshToken = StorageUtilsHelper.getItemFromLocalStorage(
        STORE_KEYS.USER_REFRESH_TOKEN
      ) as string | null;

      if (!refreshToken) return;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${authRoutes.refreshToken}`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          data?.responseData;

        StorageUtilsHelper.saveToLocalStorage(
          [STORE_KEYS.USER_ACCESS_TOKEN, accessToken],
          [STORE_KEYS.USER_REFRESH_TOKEN, newRefreshToken]
        );

        await queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.CURRENT_USER],
        });
      } catch (error) {
        console.warn("Token refresh failed", error);
        StorageUtilsHelper.deleteFromLocalStorage([
          STORE_KEYS.USER_ACCESS_TOKEN,
          STORE_KEYS.USER_REFRESH_TOKEN,
        ]);
        window.location.href = "/signin";
      }
    };

    const interval = setInterval(refresh, 1000 * 60 * 10);

    refresh();

    return () => clearInterval(interval);
  }, [queryClient]);
};
