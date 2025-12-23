"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { EventHelper } from "@/helpers/event-helper";

export const AuthSyncProvider = () => {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLogout = () => {
      logout();
      queryClient.clear();

      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/signin";
      } else {
        window.location.href = "/";
      }
    };

    // BroadcastChannel
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(EventHelper.AUTH_EVENTS.LOGOUT);
      channel.onmessage = handleLogout;
    }

    // storage fallback
    const onStorage = (e: StorageEvent) => {
      if (e.key === EventHelper.AUTH_EVENTS.LOGOUT) {
        handleLogout();
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      channel?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [logout, queryClient]);

  return null;
};
