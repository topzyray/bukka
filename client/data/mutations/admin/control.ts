import { useCustomMutation } from "../base";
import { AdminControlApiService } from "@/data/services";

export const useClearAllCache = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useCustomMutation(AdminControlApiService.invalidateAllCache, {
    onSuccessCallback() {
      onSuccess?.();
    },
  });
};
