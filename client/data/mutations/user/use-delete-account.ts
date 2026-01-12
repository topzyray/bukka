import { queryClient } from "@/lib";
import { UserApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { useAuth } from "@/providers";
import { QueryKeyEnum } from "@/data/enums";

export const useDeleteMyAccount = () => {
  const { logout } = useAuth();

  return useCustomMutation(UserApiService.deleteUserAccount, {
    onSuccessCallback: async () => {
      queryClient.removeQueries({ queryKey: [QueryKeyEnum.CURRENT_USER] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      logout();
    },
  });
};
