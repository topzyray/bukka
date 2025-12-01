import { QueryKeyEnum } from "@/data/enums";
import { useCustomMutation } from "@/data/mutations/base";
import { RecommendationApiService } from "@/data/services";
import { useQueryClient } from "@tanstack/react-query";

export const useAddRecommendation = ({
  resetForm,
  onSuccess,
}: {
  resetForm: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(RecommendationApiService.createRecommenation, {
    onSuccessCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.RECOMMENDATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT],
      });
      resetForm();
      onSuccess?.();
    },
  });
};

export const useApproveRecommendation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(RecommendationApiService.approveRecommendation, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.RECOMMENDATIONS],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      onSuccess?.();
    },
  });
};

export const useRejectRecommendation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(RecommendationApiService.rejectRecommendation, {
    onSuccessCallback: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.RECOMMENDATIONS],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESSES],
      });
      onSuccess?.();
    },
  });
};

export const useDeleteRecommendation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useCustomMutation(RecommendationApiService.deleteRecommendation, {
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
