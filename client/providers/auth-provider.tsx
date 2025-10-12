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
import { useSignOut } from "@/server/mutations/auth/use-signout";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useUserFiles } from "@/server/queries";

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
  const { mutate: signOut } = useSignOut();
  const { data: user, isLoading, isError } = useCurrentUser();
  const {
    data: userFiles,
    isLoading: isLoadingUserFiles,
    isError: isUserFilesError,
  } = useUserFiles({ userId: user?.id });

  const logout = useCallback(() => {
    try {
      signOut({});
    } catch (e) {}
    try {
      queryClient.clear();
      Cookies.remove("sidebarState");
    } catch (e) {}
    window.location.href = "/signin";
  }, [queryClient, signOut]);

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
