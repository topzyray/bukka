import { useQueryClient } from "@tanstack/react-query";
import { UserApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { QueryKeyEnum } from "@/data/enums";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useCustomMutation(UserApiService.updateUserProfile, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.CURRENT_USER],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
    },
  });
};
