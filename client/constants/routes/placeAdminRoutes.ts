import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IPlaceAdminApi = "searchPlace" | "importOne" | "importMany";

const rawPlaceAdminRoute: Record<IPlaceAdminApi, string> = {
  searchPlace: "/admin/places/search",
  importOne: "/admin/places/import-one",
  importMany: "/admin/places/import-many",
};

export const placeAdminRoutes: Record<IPlaceAdminApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawPlaceAdminRoute);
