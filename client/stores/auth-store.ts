"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { StorageUtilsHelper } from "@/utils";
import { User } from "@/data/interfaces/User";
import { File } from "@/data/interfaces/File";
import { authRoutes } from "@/constants/routes";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { devtools, persist } from "zustand/middleware";
import { envConfig, HttpClient, STORE_KEYS } from "@/configs";
import { EventHelper } from "@/helpers/event-helper";
import { useReactQueryClient } from "@/providers";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isError: boolean;
  isLoading: boolean;
  userFiles: File[];
  isLoadingUserFiles: boolean;
  isUserFilesError: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setUserFiles: (files: File[]) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, _get) => {
        const pathname =
          typeof window !== "undefined" ? window.location.pathname : "/";
        const queryClient = new QueryClient();

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
            queryClient.clear();
            Cookies.remove("sidebarState");
          } catch {}

          EventHelper.broadcastLogout();

          set({ user: null, isAuthenticated: false });

          if (pathname.startsWith("/dashboard")) {
            window.location.href = "/signin";
          } else {
            window.location.href = "/";
          }
        };

        return {
          user: null,
          isAuthenticated: false,
          isError: false,
          isLoading: true,
          userFiles: [],
          isLoadingUserFiles: false,
          isUserFilesError: false,
          logout,
          setUser: (user) =>
            set({
              user,
              isAuthenticated: !!user,
              isError: !user ? true : false,
              isLoading: false,
            }),
          setUserFiles: (files) => set({ userFiles: files }),
        };
      },
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
