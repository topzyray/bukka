import React, { useState, useMemo, useCallback } from "react";
import {
  BellIcon,
  Loader2,
  MailOpen,
  Trash2,
  Search,
  X,
  Mail,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useInfiniteUserNotifications,
  useNotificationUnreadCount,
} from "@/data/queries";
import { useAuth } from "@/providers";
import {
  useReadAllNotificaiton,
  useReadNotificaiton,
} from "@/data/mutations/userNotification/use-read-notification";
import Link from "next/link";
import { UserNotification } from "@/data/interfaces/Notification";
import { TextHelper } from "@/helpers";
import { useClearAllNotifications } from "@/data/mutations/userNotification/use-clear-notification";
import { debounce } from "@/utils";
import { Badge } from "../ui/badge";
import { PulseLoader } from "react-spinners";

const PAGE_SIZE = 10;

const NotificationItem = ({
  notification,
  onClick,
  isReading,
}: {
  notification: UserNotification;
  onClick: () => void;
  isReading: boolean;
}) => {
  return (
    <div
      className={cn(
        "cursor-pointer flex justify-between p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
        !notification?.isRead
          ? "bg-amber-700/20 dark:bg-blue-950/30 font-medium"
          : "text-primary dark:text-gray-400"
      )}
    >
      <div className="flex items-start gap-3 ">
        <div>
          <div className="relative">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full flex-shrink-0 absolute -top-0.5 -right-0.5",
                !notification?.isRead
                  ? "bg-green-500 animate-ping"
                  : "bg-transparent"
              )}
            />
            <span>
              {!notification?.isRead ? (
                <Mail size={20} />
              ) : (
                <MailOpen size={20} />
              )}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary dark:text-white leading-tight truncate">
            {notification?.title}
          </p>
          <p className="text-xs mt-0.5 leading-snug truncate">
            {notification?.message}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {TextHelper.smartTimeAgo(notification?.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {isReading ? (
          <PulseLoader size={10} />
        ) : !notification?.isRead ? (
          <Badge onClick={onClick}>Mark as Read</Badge>
        ) : null}
        {notification?.link && (
          <Link href={notification?.link}>
            <Badge variant="outline" className="hover:animate-pulse-glow">
              Details
            </Badge>
          </Link>
        )}
      </div>
    </div>
  );
};

export function Notifications() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

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
    isMenuOpen: isMenuOpen,
    limit: PAGE_SIZE,
    searchQuery: searchQuery,
  });

  const markAllReadMutation = useReadAllNotificaiton({ userId: user?.id });
  const readNotificationMutation = useReadNotificaiton({ userId: user?.id });
  const clearAllMutation = useClearAllNotifications({ userId: user?.id });

  const allNotifications: UserNotification[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const unreadCount = useNotificationUnreadCount({ userId: user?.id });

  const totalRecords = data?.pages[0]?.totalRecords || 0;
  const isListEmpty = totalRecords === 0 && !isLoading;

  // Handler for "View More" button
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
      setSearchQuery(value);
      debouncedRefetch(); // only fires after debounce delay
    },
    [debouncedRefetch]
  );

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full px-4"
          aria-label={`Notifications: ${unreadCount} unread`}
        >
          <section className="relative flex cursor-pointer hover:scale-105 text-primary dark:text-white transition-transform">
            {/* Red Badge for Unread Count */}
            {unreadCount?.data?.responseData?.count && (
              <span className="absolute -top-0.5 right-0 z-10 h-4 w-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white leading-none">
                {unreadCount?.data?.responseData?.count > 9
                  ? "9+"
                  : unreadCount?.data?.responseData?.count}
                <span className="absolute -inset-0 inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-75"></span>
              </span>
            )}
            <span>
              <Bell className="transition-all scale-100 rotate-0" />
            </span>
          </section>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-w-sm w-full p-0 shadow-lg border border-gray-100 dark:border-gray-800"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center p-4">
          <Link href={`/dashboard/${user?.role.toLowerCase()}/notifications`}>
            <h4 className="text-lg font-semibold hover:underline">
              All Notifications ({totalRecords})
            </h4>
          </Link>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => markAllReadMutation.mutate()}
              disabled={
                markAllReadMutation.isPending ||
                isListEmpty ||
                unreadCount?.data?.responseData?.count === 0
              }
            >
              {markAllReadMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <MailOpen className="w-4 h-4 mr-1" />
              )}
              Read All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

        <DropdownMenuSeparator className="m-0" />

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notifications..."
              className="pl-10 h-9"
              value={searchQuery}
              onChange={handleSearchChange}
              // Optional: You could add a debounce here for better performance
            />
          </div>
        </div>

        <DropdownMenuSeparator className="m-0" />

        {/* Content Section */}
        <ScrollArea className="h-[20rem] max-h-[70vh]">
          <div className="p-2 space-y-1">
            {/* Initial Loading */}
            {isLoading && (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {data === undefined && !isLoading && (
              <div className="flex h-40 flex-col items-center justify-center text-red-500 dark:text-red-400">
                <X className="w-6 h-6 mb-2" />
                <p>Error loading notifications.</p>
                <Button variant="link" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {isListEmpty && (
              <div className="flex h-40 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <BellIcon className="w-6 h-6 mb-2" />
                <p>You&apos;re all caught up!</p>
                <p className="text-xs">
                  No notifications found
                  {searchQuery ? ` for "${searchQuery}"` : "."}
                </p>
              </div>
            )}

            {/* Notifications List */}
            {allNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => readNotificationMutation.mutate(notification.id)}
                isReading={readNotificationMutation.isPending}
              />
            ))}

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
            {isFetching &&
              !isFetchingNextPage &&
              allNotifications.length > 0 && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
