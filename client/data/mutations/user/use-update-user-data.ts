import { useCustomMutation } from "@/data/mutations/base";
import { UserApiService } from "@/data/services/UserApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateUserData = ({
  onSuccess,
  toastStatusMessage,
}: {
  onSuccess?: () => void;
  toastStatusMessage?: boolean;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserApiService.updateUser, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      onSuccess?.();
    },
    toastStatusMessage,
    onErrorCallback: () => {},
  });
};
