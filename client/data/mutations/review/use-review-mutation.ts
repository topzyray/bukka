import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../base";
import { ReviewApiService } from "@/data/services";

export const useCreateReview = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ReviewApiService.addReview, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-activities-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      onSuccess?.();
    },
  });
};

export const useUpdateReview = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useCustomMutation(ReviewApiService.updateReview, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-activities-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      onSuccess?.();
    },
  });
};
