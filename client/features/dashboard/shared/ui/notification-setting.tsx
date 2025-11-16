"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/providers";
import { extractErrorMessage } from "@/utils";
import { motion } from "framer-motion";
import { SettingsPageTitleCard } from "../components/setting-title-card";
import { NotificationPreferencesCard } from "../components/notification-preference-card";
import { useNotificationSetting } from "@/data/queries";

export function NotificationSettings() {
  const { user } = useAuth();

  const {
    data: settingsApiData,
    isLoading: isLoadingSettings,
    isError: isSetttingError,
    error: settingsError,
    refetch,
  } = useNotificationSetting({
    userId: user?.id as number,
  });

  const userSettings = settingsApiData?.responseData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="Notification Preferences"
        description="View and manage notification preferences."
      />

      <div className="flex flex-col lg:flex-row">
        <div className="w-full rounded-xl shadow-md border dark:border-sidebar-accent overflow-hidden transition-all hover:shadow-lg">
          <div className="">
            {isLoadingSettings && (
              <div className="flex justify-center items-center py-16 text-muted-foreground capitalize">
                <Loader2 className="w-5 h-5 animate-spin mr-2 capitalize" />
                Loading user notification settings
              </div>
            )}

            {isSetttingError && (
              <div className="flex flex-col items-center justify-center text-destructive text-sm py-10">
                <AlertTriangle className="w-5 h-5 mb-2" />
                {extractErrorMessage(settingsError) ||
                  "Failed to load sessions"}
                <button
                  onClick={() => refetch()}
                  className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
                >
                  Retry
                </button>
              </div>
            )}

            {!isLoadingSettings && userSettings && (
              <NotificationPreferencesCard />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
