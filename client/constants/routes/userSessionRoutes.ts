import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserSessionApi =
  | "getLoggedUserSession"
  | "getUserActiveSession"
  | "deleteSessionById";

const rawUserSessionRoutes: Record<IUserSessionApi, string> = {
  getLoggedUserSession: "/users/sessions",
  getUserActiveSession: "/users/sessions/active-session",
  deleteSessionById: "/users/sessions",
};

export const userSessionRoutes: Record<IUserSessionApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawUserSessionRoutes);
