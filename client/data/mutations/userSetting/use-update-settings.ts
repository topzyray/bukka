import { NotificationSettingApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    NotificationSettingApiService.updateMyNotificationSetting,
    {
      onSuccessCallback() {
        queryClient.invalidateQueries({ queryKey: ["notification-setting"] });
      },
    }
  );
};
