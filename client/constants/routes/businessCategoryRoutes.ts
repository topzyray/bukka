import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IBusinessCategoryApi =
  | "createCategory"
  | "getCategories"
  | "getCategoryById"
  | "updateCategory"
  | "deleteCategory";

const rawBusinessCategoryRoutes: Record<IBusinessCategoryApi, string> = {
  createCategory: "/business-categories",
  getCategories: "/business-categories",
  getCategoryById: "/business-categories",
  updateCategory: "/business-categories",
  deleteCategory: "/business-categories",
};

export const businessCategoryRoutes: Record<IBusinessCategoryApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawBusinessCategoryRoutes);
