import { UserNotificationApiService } from "@/server/services";
import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";

export const useClearAllNotifications = ({ userId }: { userId?: number }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserNotificationApiService.deleteAllNofifications, {
    onSuccessCallback() {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
    },
  });
};
