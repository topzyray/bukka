import { AuthApiService } from "@/data/services/AuthApiService";
import { useCustomMutation } from "@/data/mutations/base";
import { toast } from "sonner";
import { queryClient } from "@/lib";
import { QueryKeyEnum } from "@/data/enums";

export const useSignOut = () => {
  return useCustomMutation(AuthApiService.signOut, {
    onSuccessCallback: () => {
      toast.success("Success", {
        description: "You are signed out successfully!",
      });
      queryClient.removeQueries({ queryKey: [QueryKeyEnum.CURRENT_USER] });
    },
  });
};
