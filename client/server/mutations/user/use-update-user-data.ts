import { useCustomMutation } from "@/server/mutations/base";
import { UserApiService } from "@/server/services/UserApiService";
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
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onSuccess?.();
    },
    toastStatusMessage,
    onErrorCallback: () => {},
  });
};
