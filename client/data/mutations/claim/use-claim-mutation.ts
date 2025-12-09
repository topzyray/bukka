import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "@/data/mutations/base";
import { ClaimApiService } from "@/data/services";
import { useQueryClient } from "@tanstack/react-query";

export const useApproveClaim = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ClaimApiService.approveClaim, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CLAIMS],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      onSuccess?.();
    },
  });
};

export const useRejectClaim = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ClaimApiService.rejectClaim, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CLAIMS],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      onSuccess?.();
    },
  });
};

export const useDeleteClaim = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ClaimApiService.deleteClaim, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_CLAIMS],
      });
      onSuccess?.();
    },
  });
};
