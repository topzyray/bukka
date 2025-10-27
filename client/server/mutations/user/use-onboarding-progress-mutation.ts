import { User } from "@/server/interfaces/User";
import { useCustomMutation } from "@/server/mutations/base";
import { UserApiService } from "@/server/services/UserApiService";
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
        queryKey: ["onboarding-progress", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    toastStatusMessage,
    onErrorCallback: () => {},
  });
};
