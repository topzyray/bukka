import { AuthApiService } from "@/server/services/AuthApiService";
import { useCustomMutation } from "@/server/mutations/base";
import { toast } from "sonner";

export const useSignOut = () => {
  return useCustomMutation(AuthApiService.signOut, {
    onSuccessCallback: () => {
      toast.info("You are signed out successfully!");
    },
  });
};
