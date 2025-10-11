import { User } from "@/server/interfaces/User";
import { useCustomMutation } from "@/server/mutations/base";
import { UserApiService } from "@/server/services/UserApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useSaveOnboardingProgress = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserApiService.saveOnboardingProgress, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-progress", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onErrorCallback: () => {},
  });
};
