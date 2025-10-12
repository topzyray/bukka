import { useCustomMutation } from "@/server/mutations/base";
import { UserApiService } from "@/server/services/UserApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useCompleteProfileOnboarding = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserApiService.completeProfileOnboarding, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onSuccess?.();
    },
  });
};
