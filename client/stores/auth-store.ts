"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { StorageUtilsHelper } from "@/utils";
import { AuthStatus, User } from "@/data/interfaces/User";
import { File } from "@/data/interfaces/File";
import { authRoutes } from "@/constants/routes";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { devtools, persist } from "zustand/middleware";
import { envConfig, HttpClient, STORE_KEYS } from "@/configs";
import { EventHelper } from "@/helpers/event-helper";
import { useReactQueryClient } from "@/providers";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, _get) => {
        const pathname =
          typeof window !== "undefined" ? window.location.pathname : "/";
        // const queryClient = new QueryClient();

        const logout = async () => {
          try {
            await axios.post(
              `${envConfig.NEXT_PUBLIC_API_BASE_URL}${authRoutes.signOut}`,
              {},
              { withCredentials: true }
            );

            StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.DEVICE_ID);
            try {
              StorageUtilsHelper.deleteFromLocalStorage(
                STORE_KEYS.HAS_SESSION_KEY
              );
              window.dispatchEvent(new Event("sessionHandledReset"));
              HttpClient.resetSessionExpiredFlag();
            } catch {}
          } catch (error) {
            try {
              StorageUtilsHelper.deleteFromLocalStorage(
                STORE_KEYS.HAS_SESSION_KEY
              );
              window.dispatchEvent(new Event("sessionHandledReset"));
              HttpClient.resetSessionExpiredFlag();
            } catch {}
            throw error;
          }

          try {
            // queryClient.clear();
            Cookies.remove("sidebarState");
          } catch {}

          EventHelper.broadcastLogout();

          set({
            user: null,
            status: "unauthenticated",
          });

          if (pathname.startsWith("/dashboard")) {
            window.location.href = "/signin";
          } else {
            window.location.href = "/";
          }
        };

        return {
          user: null,
          status: "bootstrapping",
          logout,
          setUser: (user) =>
            set({
              user,
              status: "authenticated",
            }),
        };
      },
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          status: state.status,
        }),
      }
    )
  )
);
