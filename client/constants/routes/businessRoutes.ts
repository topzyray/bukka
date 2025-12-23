import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IBusinessApi =
  | "createBusiness"
  | "getBusinesses"
  | "getBusinessById"
  | "getFeaturedBusinesses"
  | "getBusinessesByBounds"
  | "getLoggedInVendorBusinesses"
  | "setBusinessAsFeatured"
  | "updateBusiness"
  | "deleteBusiness";

const rawBusinessRoutes: Record<IBusinessApi, string> = {
  createBusiness: "/businesses",
  getBusinesses: "/businesses",
  getBusinessById: "/businesses",
  getFeaturedBusinesses: "/businesses/featured",
  getBusinessesByBounds: "/businesses/bounds",
  getLoggedInVendorBusinesses: "/businesses/my-businesses",
  setBusinessAsFeatured: "/businesses",
  updateBusiness: "/businesses",
  deleteBusiness: "/businesses",
};

export const businessRoutes: Record<IBusinessApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawBusinessRoutes);
