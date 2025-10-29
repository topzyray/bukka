import { FavoriteApiService } from "../services";
import { useCustomQuery } from "./base";
import { useCurrentUser } from "./use-current-user";

export const useFavorites = () => {
  const { data: currentUser } = useCurrentUser();
  return useCustomQuery(
    ["favorites"],
    () => FavoriteApiService.getLoggedinUserFavorites(),
    { enabled: !!currentUser?.id }
  );
};
