import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../base";
import { FavoriteApiService } from "@/server/services";
import { ToggleFavoriteDto } from "@/server/dtos";

export const useToggleFavorite = () => {
  const qc = useQueryClient();

  return useCustomMutation(FavoriteApiService.toggleFavorite, {
    onMutate: async (payload: ToggleFavoriteDto) => {
      await qc.cancelQueries({ queryKey: ["favorites"] });
      const prev = qc.getQueryData<number[]>(["favorites"]) || [];

      const isFavorite = prev.includes(payload.businessId);
      const next = isFavorite
        ? prev.filter((id) => id !== payload.businessId)
        : [...prev, payload.businessId];

      qc.setQueryData(["favorites"], next);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["favorites"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
