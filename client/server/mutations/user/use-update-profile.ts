import { useQueryClient } from "@tanstack/react-query";
import { UserApiService } from "@/server/services";
import { useCustomMutation } from "../base";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useCustomMutation(UserApiService.updateUserProfile, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
