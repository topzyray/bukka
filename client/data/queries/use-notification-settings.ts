import { QueryKeyEnum } from "../enums";
import { NotificationSettings } from "../interfaces/NotificationSetting";
import { NotificationSettingApiService } from "../services";
import { BukkaResponse, useCustomQuery } from "./base";

export const useNotificationSetting = ({ userId }: { userId: number }) => {
  return useCustomQuery<BukkaResponse<NotificationSettings>>(
    [QueryKeyEnum.NOTIFICATION_SETTING],
    () => NotificationSettingApiService.getMyNotificationSetting(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 20,
    }
  );
};
