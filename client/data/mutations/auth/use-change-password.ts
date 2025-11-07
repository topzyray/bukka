import { AuthApiService } from "@/data/services";
import { useCustomMutation } from "@/data/mutations/base";
import { UseFormReset } from "react-hook-form";

export const useChangePassword = ({
  resetForm,
}: {
  resetForm: UseFormReset<{
    currentPassword: string;
    newPassword: string;
  }>;
}) => {
  return useCustomMutation(AuthApiService.changePassword, {
    onSuccessCallback: () => {
      resetForm();
    },
  });
};
