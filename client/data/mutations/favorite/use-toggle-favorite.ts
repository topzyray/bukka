import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../base";
import { FavoriteApiService } from "@/data/services";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useCustomMutation(FavoriteApiService.toggleFavorite, {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["user-activities-summary"] });
    },
  });
};
