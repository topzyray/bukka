import { queryClient } from "@/lib";
import { useCustomMutation } from "../base";
import { FavoriteApiService } from "@/data/services";
import { QueryKeyEnum } from "@/data/enums";

export const useToggleFavorite = () => {
  return useCustomMutation(FavoriteApiService.toggleFavorite, {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.FAVOURITES] });
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
