import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../base";
import { ReviewApiService } from "@/data/services";
import { QueryKeyEnum } from "@/data/enums";

export const useReplyReview = () => {
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
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.NOTIFICATIONS_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.UNREAD_COUNT],
      });
    },
  });
};
