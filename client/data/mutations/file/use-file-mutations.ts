import { useCustomMutation } from "@/data/mutations/base";
import { FileApiService } from "@/data/services";

export const useDeleteFile = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useCustomMutation(FileApiService.deleteFile, {
    onSuccessCallback: () => {
      onSuccess?.();
    },
  });
};
