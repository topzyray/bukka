import { useCustomMutation } from "@/server/mutations/base";
import { FieldValues, UseFormReset } from "react-hook-form";
import { UserApiService } from "@/server/services/UserApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateUserData = <T extends FieldValues>({
  resetForm,
}: {
  resetForm: UseFormReset<T>;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserApiService.saveOnboardingProgress, {
    onSuccessCallback: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onErrorCallback: () => {},
  });
};
