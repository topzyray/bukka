import { useQueryClient } from "@tanstack/react-query";
import { UserApiService } from "@/data/services";
import { useCustomMutation } from "../base";
import { useAuth } from "@/providers";

export const useDeleteMyAccount = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useCustomMutation(UserApiService.deleteUserAccount, {
    onSuccessCallback: async () => {
      queryClient.removeQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      logout();
    },
  });
};
