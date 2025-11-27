import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../base";
import { ReviewApiService } from "@/data/services";
import { QueryKeyEnum } from "@/data/enums";

export const useCreateReview = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ReviewApiService.addReview, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_REVIEWS],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.USER_REVIEWS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      onSuccess?.();
    },
  });
};

export const useUpdateReview = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ReviewApiService.updateReview, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.BUSINESS_REVIEWS],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.USER_REVIEWS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
      onSuccess?.();
    },
  });
};
