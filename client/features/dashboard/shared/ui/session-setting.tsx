"use client";

import { formatDistanceToNow } from "date-fns";
import {
  MonitorSmartphone,
  Globe,
  Clock,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUserActionSessions,
  useUserSessions,
} from "@/data/queries/use-sessions";
import { useAuth } from "@/providers";
import { extractErrorMessage, StorageUtilsHelper } from "@/utils";
import { STORE_KEYS } from "@/configs";
import { TextHelper } from "@/helpers";
import { BukkaButton } from "@/components/ui";
import { motion } from "framer-motion";
import { useRevokeSession } from "@/data/mutations/userSession/use-revoke-session";
import { useState } from "react";
import { SettingsPageTitleCard } from "../components/setting-title-card";

export function SessionsSettings() {
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const deviceId = StorageUtilsHelper.getItemFromLocalStorage(
    STORE_KEYS.DEVICE_ID
  ) as string;

  const { user, logout } = useAuth();
  const {
    data: userSessionApiData,
    isLoading: isLoadingUserSessions,
    isError: isUserSessionsError,
    error: userSessionsError,
    refetch,
  } = useUserSessions({ userId: user?.id as number });
  const userSessions = userSessionApiData?.responseData;

  const {
    data: activeSessionApiData,
    isLoading: isLoadingActiveSessions,
    isError: isActiveSessionsError,
    error: activeSessionsError,
  } = useUserActionSessions({
    query: {
      userId: user?.id as number,
      deviceId: deviceId,
    },
  });

  const currentSession = activeSessionApiData?.responseData;

  const revokeAccessMutation = useRevokeSession({
    onSuccess: () => {
      setItemToDeleteId(null);
    },
  });

  const revokeAccess = (sessionId: number) => {
    setItemToDeleteId(sessionId);
    revokeAccessMutation.mutate(sessionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto space-y-6"
    >
      <SettingsPageTitleCard
        title="All Sessions"
        description="View and manage your active login sessions across devices."
      />

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full rounded-xl shadow-md border dark:border-muted-foreground overflow-hidden transition-all hover:shadow-lg">
          <div className="">
            {(isLoadingUserSessions || isLoadingActiveSessions) && (
              <div className="flex justify-center items-center py-16 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading sessions…
              </div>
            )}

            {(isUserSessionsError || isActiveSessionsError) && (
              <div className="flex flex-col items-center justify-center text-destructive text-sm py-10">
                <AlertTriangle className="w-5 h-5 mb-2" />
                {extractErrorMessage(userSessionsError) ||
                  extractErrorMessage(activeSessionsError) ||
                  "Failed to load sessions"}
                <button
                  onClick={() => refetch()}
                  className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
                >
                  Retry
                </button>
              </div>
            )}

            {!isLoadingUserSessions &&
              !isUserSessionsError &&
              userSessions &&
              userSessions.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  No active sessions found.
                </div>
              )}

            {!isLoadingUserSessions &&
              currentSession !== undefined &&
              userSessions &&
              userSessions.length > 0 && (
                <ul className="divide-y divide-muted-foreground">
                  {userSessions.map((session) => {
                    const isExpired =
                      new Date(session.expiresAt).getTime() < Date.now();
                    const isCurrent = currentSession?.id === session.id;

                    return (
                      <li
                        key={session.id}
                        className={cn(
                          "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 p-6 hover:bg-muted/30 transition-colors duration-150",
                          isCurrent && "bg-primary/5"
                        )}
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                            <MonitorSmartphone className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate max-w-[230px] sm:max-w-[400px]">
                              {TextHelper.parseUserAgent(session.userAgent)}
                            </span>

                            {isCurrent && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                                This device
                              </span>
                            )}
                            {isExpired && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-destructive/10 text-destructive dark:bg-foreground">
                                Expired
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {session.ipAddress && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                {session.ipAddress}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Last active{" "}
                              {/* {formatDistanceToNow(
                                new Date(session.updatedAt),
                                {
                                  addSuffix: true,
                                }
                              )} */}
                              {TextHelper.smartTimeAgo(session?.updatedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "text-sm font-medium",
                              isExpired
                                ? "text-destructive dark:bg-foreground p-1.5 rounded-md"
                                : "text-green-600 dark:text-green-400"
                            )}
                          >
                            {isExpired
                              ? "Expired"
                              : `Expires ${formatDistanceToNow(
                                  new Date(session.expiresAt),
                                  { addSuffix: true }
                                )}`}
                          </div>

                          <BukkaButton
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              revokeAccess(session?.id);
                              if (isCurrent) logout();
                            }}
                            className="text-white transition-colors dark:bg-destructive"
                            aria-label={`Revoke session ${session.id}`}
                            title="Revoke Session Access"
                            disabled={
                              revokeAccessMutation.isPending &&
                              itemToDeleteId === session.id
                            }
                          >
                            {revokeAccessMutation.isPending &&
                            itemToDeleteId === session.id ? (
                              <span className="flex items-center gap-1">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Revoke
                              </span>
                            )}
                          </BukkaButton>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
