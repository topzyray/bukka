import { useQueryClient } from "@tanstack/react-query";
import { UserApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { QueryKeyEnum } from "@/data/enums";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useCustomMutation(UserApiService.updateUserProfile, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.CURRENT_USER],
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
    },
  });
};
