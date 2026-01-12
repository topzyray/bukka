import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "@/data/mutations/base";
import { UserApiService } from "@/data/services/UserApiService";
import { queryClient } from "@/lib";

export const useCompleteProfileOnboarding = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useCustomMutation(UserApiService.completeProfileOnboarding, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.CURRENT_USER] });
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
