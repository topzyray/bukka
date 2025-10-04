"use client";

import Cookies from "js-cookie";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User } from "@/api/interfaces/User";
import { CustomJwtPayload } from "@/api/interfaces/Auth";

interface IAuthContextType {
  userDetails: User | null;
  saveUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  accessTokenData: CustomJwtPayload | null;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<IAuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, saveUserDetails] = useState<User | null>(null);
  const [accessTokenData, setAccessTokenData] =
    useState<CustomJwtPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    Cookies.set("sidebarState", "false");
    setJustLoggedOut(true);
    saveUserDetails(null);
    queryClient.clear();
    Cookies.remove("sidebarState");
    StorageUtilsHelper.deleteFromLocalStorage([
      STORE_KEYS.USER_DETAILS,
      STORE_KEYS.USER_ACCESS_TOKEN,
      STORE_KEYS.USER_REFRESH_TOKEN,
      "exam-progress",
    ]);
  }, [queryClient]);

  const fetchUser = useCallback(async () => {
    try {
      const storedData = StorageUtilsHelper.getItemsFromLocalStorage([
        STORE_KEYS.USER_DETAILS,
        STORE_KEYS.USER_ACCESS_TOKEN,
      ]);

      const userDetails = storedData[STORE_KEYS.USER_DETAILS] as
        | User
        | undefined;
      const accessToken = storedData[STORE_KEYS.USER_ACCESS_TOKEN] as
        | string
        | undefined;

      if (accessToken) {
        try {
          setAccessTokenData(jwtDecode<CustomJwtPayload>(accessToken));
        } catch {
          console.error("Invalid token, logging out...");

          setLoading(false);
          return;
        }
      }

      if (!userDetails || !accessToken) {
        setLoading(false);
        return;
      }

      saveUserDetails(userDetails);
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (justLoggedOut) return;
    fetchUser();
  }, [fetchUser, justLoggedOut]);

  const value = useMemo(
    () => ({
      userDetails,
      saveUserDetails,
      accessTokenData,
      logout,
      loading,
    }),
    [accessTokenData, loading, logout, userDetails]
  );

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="border-primary mx-auto h-14 w-14 animate-spin rounded-full border-8 border-dashed"></div>
          <p className="mt-4 text-base font-semibold lg:text-xl lg:font-semibold">
            Loading...
          </p>
        </motion.div>
      </div>
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
