import { AuthApiService } from "@/data/services";
import { useCustomMutation } from "@/data/mutations/base";
import { UseFormReset } from "react-hook-form";
import { QueryKeyEnum } from "@/data/enums";
import { useQueryClient } from "@tanstack/react-query";

export const useChangePassword = ({
  resetForm,
}: {
  resetForm: UseFormReset<{
    currentPassword: string;
    newPassword: string;
  }>;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(AuthApiService.changePassword, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT],
      });
      resetForm();
    },
  });
};
