import { QueryKeyEnum } from "@/data/enums";
import { User } from "@/data/interfaces/User";
import { useCustomMutation } from "@/data/mutations/base";
import { UserApiService } from "@/data/services/UserApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useSaveOnboardingProgress = ({
  user,
  toastStatusMessage,
}: {
  user: User;
  toastStatusMessage?: boolean;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserApiService.updateUser, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ONBOARDING_PROGRESS, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.CURRENT_USER] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
    },
    toastStatusMessage,
    onErrorCallback: () => {},
  });
};
