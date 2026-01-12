"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { StorageUtilsHelper } from "@/utils";
import { AuthStatus, User } from "@/data/interfaces/User";
import { authRoutes } from "@/constants/routes";
import { devtools, persist } from "zustand/middleware";
import { envConfig, HttpClient, STORE_KEYS } from "@/configs";
import { EventHelper } from "@/helpers/event-helper";

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

        // const bootstrap = async () => {
        //   set({ status: "bootstrapping" });
        //   try {
        //     const hasSession = !!localStorage.getItem(
        //       STORE_KEYS.HAS_SESSION_KEY
        //     );
        //     if (hasSession) {
        //       // Optional: fetch user from API here
        //       // const { data } = await axios.get(`${envConfig.NEXT_PUBLIC_API_BASE_URL}/me`, { withCredentials: true });
        //       // set({ user: data, status: "authenticated" });
        //       set({ status: "authenticated" });
        //     } else {
        //       set({ status: "unauthenticated" });
        //     }
        //   } catch {
        //     set({ status: "unauthenticated" });
        //   } finally {
        //     set({ status: "bootstrapping" });
        //   }
        // };

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

        // bootstrap();

        return {
          user: null,
          status: "unauthenticated",
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
