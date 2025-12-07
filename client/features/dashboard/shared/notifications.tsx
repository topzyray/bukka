"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInfiniteUserNotifications,
  useNotificationUnreadCount,
} from "@/data/queries";
import { useReadAllNotificaiton } from "@/data/mutations/userNotification/use-read-notification";
import { useClearAllNotifications } from "@/data/mutations/userNotification/use-clear-notification";
import { useAuth } from "@/providers";
import { BellIcon, Loader2, MailOpen, Search, Trash2, X } from "lucide-react";
import { UserNotification } from "@/data/interfaces/Notification";
import { debounce } from "@/utils";
import { Input } from "@/components/ui";
import { NotificationCard } from "./components/notification-card";

export function Notifications() {
  const PAGE_SIZE = 10;
  const { user } = useAuth();

  const [search, setSearch] = useState<string>("");

  const { data: unreadCountApiData } = useNotificationUnreadCount({
    userId: user?.id,
  });
  const unreadCount = unreadCountApiData?.responseData?.count;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteUserNotifications({
    userId: user?.id,
    isMenuOpen: true,
    limit: PAGE_SIZE,
    searchQuery: search,
  });

  const allNotifications: UserNotification[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const totalRecords = data?.pages[0]?.totalRecords || 0;
  const isListEmpty = totalRecords === 0 && !isLoading;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const debouncedRefetch = useMemo(
    () =>
      debounce(() => {
        refetch();
      }, 600), // 600ms after the user stops typing
    [refetch]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      debouncedRefetch(); // only fires after debounce delay
    },
    [debouncedRefetch]
  );

  const markAllReadMutation = useReadAllNotificaiton({ userId: user?.id });
  const clearAllMutation = useClearAllNotifications({ userId: user?.id });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view all notifications
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => markAllReadMutation.mutate()}
            disabled={
              markAllReadMutation.isPending || isListEmpty || unreadCount === 0
            }
          >
            {markAllReadMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <MailOpen className="w-4 h-4 mr-1" />
            )}
            Mark All Read
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => clearAllMutation.mutate()}
            disabled={clearAllMutation.isPending || isListEmpty}
          >
            {clearAllMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-1" />
            )}
            Clear All
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-10 h-9"
            value={search}
            onChange={handleSearchChange}
            // Optional: You could add a debounce here for better performance
          />
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {data === undefined && !isLoading && (
        <div className="flex h-40 flex-col items-center justify-center text-red-500 dark:text-red-400">
          <X className="w-6 h-6 mb-2" />
          <p>Error loading notifications.</p>
          <Button variant="link" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {isListEmpty && (
        <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
          <BellIcon className="w-6 h-6 mb-2" />
          <p>You&apos;re all caught up!</p>
          <p className="text-xs">
            No notifications found
            {search ? ` for "${search}"` : "."}
          </p>
        </div>
      )}

      {allNotifications && (
        <div className="flex flex-col gap-3">
          {allNotifications.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>
      )}

      {/* "View More" Button / Infinite Loading Indicator */}
      {hasNextPage && (
        <div className="p-2 pt-1 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isFetchingNextPage ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "View More"
            )}
          </Button>
        </div>
      )}

      {/* General Fetching Overlay (e.g., when search changes) */}
      {isFetching && !isFetchingNextPage && allNotifications.length > 0 && (
        <div className="absolute inset-0 bg-white/50 dark:bg-muted-foreground flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
