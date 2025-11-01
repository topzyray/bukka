import { UserNotificationApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";

export const useReadAllNotificaiton = ({ userId }: { userId?: number }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserNotificationApiService.readAllMyNotification, {
    onSuccessCallback() {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
    },
  });
};

export const useReadNotificaiton = ({ userId }: { userId?: number }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    (id: number) => UserNotificationApiService.readNotificationById(id),
    {
      onSuccessCallback() {
        queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
      },
    }
  );
};
