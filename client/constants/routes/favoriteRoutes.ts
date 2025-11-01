import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFavoriteApi =
  | "toggleFavorite"
  | "getLoggedinUserFavorites"
  | "deleteFavoriteByBusinessId";

const rawFavoriteRoutes: Record<IFavoriteApi, string> = {
  toggleFavorite: "/favorites",
  getLoggedinUserFavorites: "/favorites/my-favorites",
  deleteFavoriteByBusinessId: "/favorites",
};

export const favoriteRoutes: Record<IFavoriteApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawFavoriteRoutes);
