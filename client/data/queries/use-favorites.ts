import { useAuth } from "@/providers";
import { Favorite } from "../interfaces/Favorite";
import { FavoriteApiService } from "../services";
import { BukkaResponse, PagedResponse, useCustomQuery } from "./base";

export const useFavorites = () => {
  const { user: currentUser } = useAuth();
  return useCustomQuery<BukkaResponse<PagedResponse<Favorite[]>>>(
    ["favourites"],
    () => FavoriteApiService.getLoggedinUserFavorites(),
    { enabled: !!currentUser?.id }
  );
};
