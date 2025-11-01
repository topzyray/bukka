import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IAdminControlApi = "invalidateAllCache";

const rawAdminControlRoute: Record<IAdminControlApi, string> = {
  invalidateAllCache: "/admin/control/invalidate-all-cache",
};

export const adminControlRoutes: Record<IAdminControlApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawAdminControlRoute);
