import { UserNotificationApiService } from "../services";
import { useCustomQuery } from "./base";

export const useUserNotifications = (userId?: number) => {
  useCustomQuery(
    ["notifications", userId],
    () => UserNotificationApiService.getAllMyNotifications(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );
};
