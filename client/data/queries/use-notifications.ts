import { UserNotification } from "../interfaces/Notification";
import { UserNotificationApiService } from "../services";
import { useCustomInfiniteQuery, useCustomQuery } from "./base";

export const useUserNotifications = ({
  userId,
  isMenuOpen,
  limit,
  searchQuery = "",
  initialPageParam,
}: {
  userId?: number;
  isMenuOpen?: boolean;
  limit?: number;
  searchQuery?: string;
  initialPageParam?: number;
}) => {
  return useCustomInfiniteQuery<UserNotification>(
    ["notifications", userId],
    ({ pageNumber, ...rest }) =>
      UserNotificationApiService.getAllMyNotifications({
        pageNumber: pageNumber,
        pageSize: limit ?? 10,
        search: searchQuery,
        ...rest,
      }),
    {
      params: { searchParams: searchQuery },
      enabled: !!userId && isMenuOpen,
      initialPageParam: initialPageParam ?? 1,
      staleTime: 1000 * 60 * 5,
    }
  );
};

export const useNotificationUnreadCount = ({ userId }: { userId?: number }) => {
  return useCustomQuery(
    ["unread-count", userId],
    () => UserNotificationApiService.getUnreadNotificationCount(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );
};
