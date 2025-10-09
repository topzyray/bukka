import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { FieldValues, UseFormReset } from "react-hook-form";
import { UserApiService } from "@/server/services/UserApiService";

export const useUser = <T extends FieldValues>({
  resetForm,
}: {
  resetForm: UseFormReset<T>;
}) => {
  const saveOnboardingProgressMutation = useCustomMutation(
    UserApiService.saveOnboardingProgress,
    {
      onSuccessCallback: () => {
        resetForm();
      },
      onErrorCallback: () => {},
    }
  );

  const updateUserMutation = useCustomMutation(UserApiService.updateUser, {
    onSuccessCallback: () => {
      resetForm();
    },
    onErrorCallback: () => {},
  });

  return {
    saveOnboardingProgressMutation,
    updateUserMutation,
  };
};
