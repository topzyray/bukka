import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IBusinessApi =
  | "createBusiness"
  | "getBusinesses"
  | "getBusinessById"
  | "getLoggedInVendorBusinesses"
  | "updateBusiness"
  | "deleteBusiness";

const rawBusinessRoutes: Record<IBusinessApi, string> = {
  createBusiness: "/businesses",
  getBusinesses: "/businesses",
  getBusinessById: "/businesses",
  getLoggedInVendorBusinesses: "/businesses/my-businesses",
  updateBusiness: "/businesses",
  deleteBusiness: "/businesses",
};

export const businessRoutes: Record<IBusinessApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawBusinessRoutes);
