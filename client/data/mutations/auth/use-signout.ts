import { AuthApiService } from "@/data/services/AuthApiService";
import { useCustomMutation } from "@/data/mutations/base";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "@/data/enums";

export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useCustomMutation(AuthApiService.signOut, {
    onSuccessCallback: () => {
      toast.success("Success", {
        description: "You are signed out successfully!",
      });
      queryClient.removeQueries({ queryKey: [QueryKeyEnum.CURRENT_USER] });
    },
  });
};
