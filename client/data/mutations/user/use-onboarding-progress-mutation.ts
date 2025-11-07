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
        queryKey: ["onboarding-progress", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    toastStatusMessage,
    onErrorCallback: () => {},
  });
};
