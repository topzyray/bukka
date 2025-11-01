import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserPersonalizationApi =
  | "createUserPersonalization"
  | "getLoggedUserPersonalization"
  | "updateLoggedUserPersonalization"
  | "deleteLoggedUserPersonalization";

const rawUserPersonalizationRoutes: Record<IUserPersonalizationApi, string> = {
  createUserPersonalization: "/users/personalization",
  getLoggedUserPersonalization: "/users/personalization",
  updateLoggedUserPersonalization: "/users/personalization",
  deleteLoggedUserPersonalization: "/users/personalization",
};

export const userPersonalizationRoutes: Record<
  IUserPersonalizationApi,
  string
> = RouteHelper.createRoutes(BACKEND_SVC_PATH, rawUserPersonalizationRoutes);
