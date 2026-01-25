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
import { queryClient } from "@/lib";
import { QueryKeyEnum } from "@/data/enums";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
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

        // const logout = async () => {
        //   try {
        //     await axios.post(
        //       `${envConfig.NEXT_PUBLIC_API_BASE_URL}${authRoutes.signOut}`,
        //       {},
        //       { withCredentials: true },
        //     );

        //     StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.DEVICE_ID);
        //     StorageUtilsHelper.deleteFromLocalStorage(
        //       STORE_KEYS.OAUTH_CODE_VERIFIER,
        //     );
        //     try {
        //       StorageUtilsHelper.deleteFromLocalStorage(
        //         STORE_KEYS.HAS_SESSION_KEY,
        //       );
        //       window.dispatchEvent(new Event("sessionHandledReset"));
        //       HttpClient.resetSessionExpiredFlag();
        //     } catch {}
        //   } catch (error) {
        //     try {
        //       StorageUtilsHelper.deleteFromLocalStorage(
        //         STORE_KEYS.HAS_SESSION_KEY,
        //       );
        //       window.dispatchEvent(new Event("sessionHandledReset"));
        //       HttpClient.resetSessionExpiredFlag();
        //     } catch {}
        //     throw error;
        //   }

        //   try {
        //     queryClient.clear();
        //     queryClient.removeQueries({
        //       queryKey: [QueryKeyEnum.CURRENT_USER],
        //       exact: true,
        //     });
        //     Cookies.remove("sidebarState");
        //   } catch {}

        //   EventHelper.broadcastLogout();

        //   set({
        //     user: null,
        //     status: "unauthenticated",
        //   });

        //   if (pathname.startsWith("/dashboard")) {
        //     window.location.href = "/signin";
        //   } else {
        //     window.location.href = "/";
        //   }
        // };
        const logout = async () => {
          try {
            await axios.post(
              `${envConfig.NEXT_PUBLIC_API_BASE_URL}${authRoutes.signOut}`,
              {},
              { withCredentials: true },
            );
          } catch (err) {
            console.warn("Backend logout failed:", err);
          }

          [
            STORE_KEYS.DEVICE_ID,
            STORE_KEYS.OAUTH_CODE_VERIFIER,
            STORE_KEYS.HAS_SESSION_KEY,
          ].forEach((key) => {
            try {
              StorageUtilsHelper.deleteFromLocalStorage(key);
              StorageUtilsHelper.clearLocalStorage();
            } catch (err) {
              console.warn(`Failed to delete localStorage key ${key}:`, err);
            }
          });

          try {
            window.dispatchEvent(new Event("sessionHandledReset"));
            HttpClient.resetSessionExpiredFlag();
          } catch (err) {
            console.warn("Failed to reset session flags:", err);
          }

          try {
            queryClient.removeQueries({
              queryKey: [QueryKeyEnum.CURRENT_USER],
              exact: true,
            });
            queryClient.clear();
            Cookies.remove("sidebarState");
          } catch (err) {
            console.warn("Failed to clear queries or cookies:", err);
          }

          try {
            EventHelper.broadcastLogout();
          } catch (err) {
            console.warn("Failed to broadcast logout event:", err);
          }

          set({
            user: null,
            status: "unauthenticated",
          });

          // const redirectTo = pathname.startsWith("/dashboard")
          //   ? "/signin"
          //   : "/";
          window.location.href = "/";
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
          setStatus: (status) => {
            set({
              status,
            });
          },
        };
      },
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          status: state.status,
        }),
      },
    ),
  ),
);
