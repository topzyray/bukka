import { UserNotificationApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { queryClient } from "@/lib";
import { QueryKeyEnum } from "@/data/enums";

export const useClearAllNotifications = ({ userId }: { userId?: number }) => {
  return useCustomMutation(UserNotificationApiService.deleteAllNofifications, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
    },
  });
};

export const useDeleteNotification = ({
  userId,
  onSuccess,
}: {
  userId?: number;
  onSuccess?: () => void;
}) => {
  return useCustomMutation(UserNotificationApiService.deleteNotificationById, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });

      onSuccess?.();
    },
  });
};
