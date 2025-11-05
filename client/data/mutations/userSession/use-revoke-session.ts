import { useCustomMutation } from "../base";
import { useQueryClient } from "@tanstack/react-query";
import { UserSessionApiService } from "@/data/services/UserSessionApiService";

export const useRevokeSession = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(UserSessionApiService.deleteSessionById, {
    onSuccessCallback() {
      queryClient.invalidateQueries({
        queryKey: ["user-sessions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-active-session"],
      });
      onSuccess?.();
    },
  });
};
