import { useCustomMutation } from "@/data/mutations/base";
import { UserApiService } from "@/data/services/UserApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useCompleteProfileOnboarding = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserApiService.completeProfileOnboarding, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      onSuccess?.();
    },
  });
};
