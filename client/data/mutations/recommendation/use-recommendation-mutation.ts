import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "@/data/mutations/base";
import { BusinessApiService } from "@/data/services/BusinessApiService";
import { useQueryClient } from "@tanstack/react-query";

export const useAddRecommendation = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(BusinessApiService.createBusiness, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.RECOMMENDATIONS],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      resetForm();
      onSuccess?.();
    },
  });
};

export const useApproveRecommendation = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    ({ id, payload }: { id: number; payload: any }) =>
      BusinessApiService.updateBusiness(id, payload),
    {
      onSuccessCallback: async () => {
        await queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.RECOMMENDATIONS],
        });
        await queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.BUSINESSES],
        });
        resetForm();
        onSuccess?.();
      },
    }
  );
};

export const useRejectRecommendation = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(
    ({ id, payload }: { id: number; payload: any }) =>
      BusinessApiService.updateBusiness(id, payload),
    {
      onSuccessCallback: async () => {
        await queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.RECOMMENDATIONS],
        });
        await queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.BUSINESSES],
        });
        resetForm();
        onSuccess?.();
      },
    }
  );
};

export const useDeleteRecommendation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(BusinessApiService.deleteBusiness, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.RECOMMENDATIONS],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      onSuccess?.();
    },
  });
};
