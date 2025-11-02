import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ILocationApi =
  | "getLocations"
  | "getLocationById"
  | "searchLocation"
  | "updateLocation"
  | "deleteLocation"
  | "reverseGeocode";

const rawLocationRoutes: Record<ILocationApi, string> = {
  getLocations: "/locations",
  getLocationById: "/locations",
  searchLocation: "/locations/search",
  updateLocation: "/locations",
  deleteLocation: "/locations",
  reverseGeocode: "/locations/reverse",
};

export const locationRoutes: Record<ILocationApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawLocationRoutes);
