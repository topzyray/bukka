import { UserNotificationApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { queryClient } from "@/lib";
import { QueryKeyEnum } from "@/data/enums";

export const useReadAllNotificaiton = ({ userId }: { userId?: number }) => {
  return useCustomMutation(UserNotificationApiService.readAllMyNotification, {
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

export const useReadNotificaiton = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useCustomMutation(
    (id: number) => UserNotificationApiService.readNotificationById(id),
    {
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
    }
  );
};
