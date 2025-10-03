import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISchoolAccountApi = "createSchoolAccount" | "getMySchoolAccounts";

const rawSchoolAccountRoutes: Record<ISchoolAccountApi, string> = {
  createSchoolAccount: "/school-accounts/create-school-accounts",
  getMySchoolAccounts: "/school-accounts/get-my-school-accounts",
};

// Use the function to create routes with the base path
export const schoolAccountRoutes: Record<ISchoolAccountApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawSchoolAccountRoutes,
);
