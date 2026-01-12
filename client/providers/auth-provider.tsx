"use client";

import {
  createContext,
  useMemo,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useUserFiles } from "@/data/queries";
import { AuthStatus, User } from "@/data/interfaces/User";
import { queryClient } from "@/lib";
import { File } from "@/data/interfaces/File";
import { useCurrentUser } from "@/data/queries/use-current-user";
import { useAuthStore } from "@/stores/auth-store";
import { QueryKeyEnum } from "@/data/enums";
import { EventHelper } from "@/helpers/event-helper";

interface IAuthContextType {
  status: AuthStatus;
  user: User | null;
  isError: boolean;
  logout: () => void;
  isLoading: boolean;
  userFiles: File[];
  isLoadingUserFiles: boolean;
  isUserFilesError: boolean;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isFirstLoad, isError } = useCurrentUser();

  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);

  // const { data: user, isFirstLoad, isError } = useCurrentUser();

  const {
    data: userFilesData,
    isLoading: isLoadingUserFiles,
    isError: isUserFilesError,
  } = useUserFiles({ userId: storeUser?.id });

  const userFiles = userFilesData?.data ?? [];

  useEffect(() => {
    if (storeUser) {
      setUser(storeUser);
    }
  }, [storeUser]);

  useEffect(() => {
    EventHelper.listenForLogout(() => {
      logout();
    });
  }, []);

  const value = useMemo(
    () => ({
      status,
      user: storeUser ?? null,
      isError: !!isError,
      logout,
      isLoading: isFirstLoad,
      userFiles,
      isLoadingUserFiles,
      isUserFilesError,
    }),
    [
      status,
      storeUser,
      isError,
      logout,
      isFirstLoad,
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
