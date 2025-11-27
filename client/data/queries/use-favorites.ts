import { useAuth } from "@/providers";
import { Favorite } from "../interfaces/Favorite";
import { FavoriteApiService } from "../services";
import { BukkaResponse, PagedResponse, useCustomQuery } from "./base";
import { QueryKeyEnum } from "../enums";

export const useFavorites = () => {
  const { user: currentUser } = useAuth();
  return useCustomQuery<BukkaResponse<PagedResponse<Favorite[]>>>(
    [QueryKeyEnum.FAVOURITES],
    () => FavoriteApiService.getLoggedinUserFavorites(),
    { enabled: !!currentUser?.id }
  );
};
