import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IBusinessApi =
  | "getBusinesses"
  | "getBusinessById"
  | "createBusiness"
  | "updateBusiness"
  | "deleteBusiness";

const rawBusinessRoutes: Record<IBusinessApi, string> = {
  getBusinesses: "/businesses",
  getBusinessById: "/businesses",
  createBusiness: "/businesses",
  updateBusiness: "/businesses",
  deleteBusiness: "/businesses",
};

export const businessRoutes: Record<IBusinessApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawBusinessRoutes);
