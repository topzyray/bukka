import {
  BukkaResponse,
  PagedResponse,
  QueryParams,
  useCustomInfiniteQuery,
  useCustomQuery,
} from "./base";
import { UserNotificationApiService } from "../services";
import { UserNotification } from "../interfaces/Notification";

export const useInfiniteUserNotifications = ({
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
    ["notifications-infinite", userId],
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

export const useUserNotificationsQuery = ({
  pageNumber = 1,
  search = "",
  filters = {},
  pageSize = 10,
  enabled = true,
}: {
  pageNumber?: number;
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<
    BukkaResponse<PagedResponse<UserNotification[]>>,
    Error
  >(
    ["notifications", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      UserNotificationApiService.getAllMyNotifications({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        search: params?.search ?? search,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, search, ...filters },
      enabled,
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

export const useNotificationById = ({
  notificationId,
}: {
  notificationId: number;
}) => {
  return useCustomQuery<BukkaResponse<UserNotification>>(
    ["business", notificationId],
    () => UserNotificationApiService.getNotificationById(notificationId),
    { enabled: !!notificationId, placeholderData: (prev) => prev }
  );
};
