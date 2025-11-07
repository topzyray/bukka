import { useQueryClient } from "@tanstack/react-query";
import { UserApiService } from "@/data/services";
import { useCustomMutation } from "../base";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useCustomMutation(UserApiService.updateUserProfile, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
};
