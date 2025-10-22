import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ILocationApi = "getLocations" | "searchPlaces" | "reverseGeocode";

const rawLocationRoutes: Record<ILocationApi, string> = {
  getLocations: "/locations",
  searchPlaces: "/locations/search",
  reverseGeocode: "/locations/reverse",
};

export const locationRoutes: Record<ILocationApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawLocationRoutes);
