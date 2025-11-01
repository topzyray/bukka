import { NotificationSettingApiService } from "../services";
import { useCustomQuery } from "./base";

export const useNotificationSetting = (userId?: number) => {
  useCustomQuery(
    ["notification-setting", userId],
    () => NotificationSettingApiService.getMyNotificationSetting(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );
};
