import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IBusinessCategoryApi = "getCategories" | "createCategory";

const rawBusinessCategoryRoutes: Record<IBusinessCategoryApi, string> = {
  getCategories: "/business-categories",
  createCategory: "/business-categories",
};

export const businessCategoryRoutes: Record<IBusinessCategoryApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawBusinessCategoryRoutes);
