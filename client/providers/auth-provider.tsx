"use client";

import axios from "axios";
import Cookies from "js-cookie";
import {
  createContext,
  useMemo,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { StorageUtilsHelper } from "@/utils";
import { authRoutes } from "@/constants/routes";
import { useUserFiles } from "@/data/queries";
import { AuthStatus, User } from "@/data/interfaces/User";
import { useQueryClient } from "@tanstack/react-query";
import { File } from "@/data/interfaces/File";
import { envConfig, HttpClient, STORE_KEYS } from "@/configs";
import { useCurrentUser } from "@/data/queries/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

interface IAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isError: boolean;
  logout: () => void;
  isLoading: boolean;
  status: AuthStatus;
  userFiles: File[];
  isLoadingUserFiles: boolean;
  isUserFilesError: boolean;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { isFirstLoad, isError } = useCurrentUser();

  const { user: storeUser, status } = useAuthStore();

  // const { data: user, isFirstLoad, isError } = useCurrentUser();

  const {
    data: userFilesData,
    isLoading: isLoadingUserFiles,
    isError: isUserFilesError,
  } = useUserFiles({ userId: storeUser?.id });

  const userFiles = userFilesData?.data ?? [];

  useEffect(() => {
    if (storeUser) {
      useAuthStore.getState().setUser(storeUser);
    }
  }, [storeUser]);

  const logout = useCallback(async () => {
    // try {
    //   await axios.post(
    //     `${envConfig.NEXT_PUBLIC_API_BASE_URL}${authRoutes.signOut}`,
    //     {},
    //     { withCredentials: true }
    //   );
    //   StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.DEVICE_ID);
    //   try {
    //     StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
    //     window.dispatchEvent(new Event("sessionHandledReset"));
    //     HttpClient.resetSessionExpiredFlag();
    //   } catch {}
    // } catch (error) {
    //   try {
    //     StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
    //     window.dispatchEvent(new Event("sessionHandledReset"));
    //     HttpClient.resetSessionExpiredFlag();
    //   } catch {}
    //   throw error;
    // }
    // try {
    //   queryClient.clear();
    //   Cookies.remove("sidebarState");
    // } catch {}
    // if (pathname.startsWith("/dashboard")) {
    //   window.location.href = "/signin";
    // } else {
    //   window.location.href = "/";
    // }
    useAuthStore.getState().logout();
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: storeUser ?? null,
      isAuthenticated: !!storeUser && !isError,
      isError: !!isError,
      logout,
      isLoading: isFirstLoad,
      status,
      userFiles,
      isLoadingUserFiles,
      isUserFilesError,
    }),
    [
      storeUser,
      isError,
      logout,
      isFirstLoad,
      status,
      userFiles,
      isLoadingUserFiles,
      isUserFilesError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
