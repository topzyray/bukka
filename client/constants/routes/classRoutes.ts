import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IClassApi = "createAClass" | "getAClassById" | "getAllClasses" | "getSchoolClassLevel";

const rawClassRoutes: Record<IClassApi, string> = {
  createAClass: "/classes/create-a-class",
  getAClassById: "/classes/get-a-class",
  getAllClasses: "/classes/get-classes",
  getSchoolClassLevel: "/classes/get-school-class-level",
};

// Use the function to create routes with the base path
export const classRoutes: Record<IClassApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawClassRoutes,
);
