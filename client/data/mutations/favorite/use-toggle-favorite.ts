import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../base";
import { FavoriteApiService } from "@/data/services";
import { QueryKeyEnum } from "@/data/enums";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useCustomMutation(FavoriteApiService.toggleFavorite, {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.FAVOURITES] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnum.ADMIN_OVERVIEW],
      });
    },
  });
};
