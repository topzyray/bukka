"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationsList } from "./notifications-list";
import {
  useNotificationUnreadCount,
  useUserNotificationsQuery,
} from "@/data/queries";
import { PaginationHelper } from "@/helpers/pagination-helper";
import {
  useReadAllNotificaiton,
  useReadNotificaiton,
} from "@/data/mutations/userNotification/use-read-notification";
import { useClearAllNotifications } from "@/data/mutations/userNotification/use-clear-notification";
import { useAuth } from "@/providers";
import { Loader2, MailOpen, Trash2 } from "lucide-react";
import { QueryKeyEnum } from "@/data/enums";

export function Notifications() {
  const PAGE_SIZE = 10;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  const unreadCount = useNotificationUnreadCount({ userId: user?.id });
  const { data: userNotifications, isLoading } = useUserNotificationsQuery({
    search,
    filters,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const total = userNotifications?.responseData?.total ?? 0;
  const isListEmpty = total === 0 && !isLoading;

  const currentPagedData = useMemo(() => {
    return userNotifications?.responseData?.data ?? [];
  }, [userNotifications]);

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn: pn,
      total: total,
      pageSize: PAGE_SIZE,
      queryClient: queryClient,
      queryKey: [QueryKeyEnum.NOTIFICATIONS],
      setPage: setPage,
    });
  };

  const onSortChange = (sorting: any) => {
    const s = sorting?.[0];
    const sortBy = s?.id;
    const sortOrder = s?.desc ? "desc" : "asc";
    setFilters((f) => ({ ...f, sortBy, sortOrder }));
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.NOTIFICATIONS] });
    setPage(1);
  };

  const onSearchChange = (term: string) => {
    setSearch(term);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.NOTIFICATIONS] });
    setPage(1);
  };

  const onFilterChange = (f: Record<string, any>) => {
    setFilters(f);
    queryClient.removeQueries({ queryKey: [QueryKeyEnum.NOTIFICATIONS] });
    setPage(1);
  };

  const markAllReadMutation = useReadAllNotificaiton({ userId: user?.id });
  const readNotificationMutation = useReadNotificaiton({ userId: user?.id });
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

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : currentPagedData.length ? (
        <NotificationsList notifications={currentPagedData} />
      ) : (
        <p className="text-muted-foreground text-center py-10">
          You have no notifications.
        </p>
      )}
    </div>
  );
}
