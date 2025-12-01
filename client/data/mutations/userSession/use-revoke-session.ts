import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { UserSessionApiService } from "@/data/services/UserSessionApiService";
import { QueryKeyEnum } from "@/data/enums";

export const useRevokeSession = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserSessionApiService.deleteSessionById, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVE_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT],
      });
      onSuccess?.();
    },
  });
};
