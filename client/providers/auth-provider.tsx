"use client";

import Cookies from "js-cookie";
import {
  createContext,
  useMemo,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/server/queries/use-current-user";
import { User } from "@/server/interfaces/User";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useUserFiles } from "@/server/queries";
import axios from "axios";
import { envConfig, HttpClient, STORE_KEYS } from "@/configs";
import { authRoutes } from "@/constants/routes";
import { StorageUtilsHelper } from "@/utils";
import { usePathname } from "next/navigation";

interface IAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isError: boolean;
  logout: () => void;
  isLoading: boolean;
  userFiles: any;
  isLoadingUserFiles: boolean;
  isUserFilesError: boolean;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useCurrentUser();
  const {
    data: userFiles,
    isLoading: isLoadingUserFiles,
    isError: isUserFilesError,
  } = useUserFiles({ userId: user?.id });

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${envConfig.NEXT_PUBLIC_API_BASE_URL}${authRoutes.signOut}`,
        {},
        { withCredentials: true }
      );
      StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.DEVICE_ID);
      try {
        StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
        window.dispatchEvent(new Event("sessionHandledReset"));
        HttpClient.resetSessionExpiredFlag();
      } catch {}
    } catch (error) {
      try {
        StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
        window.dispatchEvent(new Event("sessionHandledReset"));
        HttpClient.resetSessionExpiredFlag();
      } catch {}
      throw error;
    }
    try {
      queryClient.clear();
      Cookies.remove("sidebarState");
    } catch (e) {}
    window.location.href = "/signin";
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user && !isError,
      isError: !!isError,
      logout,
      isLoading: !!isLoading,
      userFiles,
      isLoadingUserFiles,
      isUserFilesError,
    }),
    [
      user,
      isError,
      logout,
      isLoading,
      userFiles,
      isLoadingUserFiles,
      isUserFilesError,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularLoader
          text="Validating..."
          textClassName="animate-pulse-glow rounded-lg px-4"
        />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
