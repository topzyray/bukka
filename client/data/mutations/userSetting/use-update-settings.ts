import { NotificationSettingApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "@/data/enums";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    NotificationSettingApiService.updateMyNotificationSetting,
    {
      onSuccessCallback() {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.NOTIFICATION_SETTING],
        });
      },
    }
  );
};
