import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISuperAdminApi =
  | "createPaymentPriority"
  | "createClassLevels"
  | "createResultSettingInASchool"
  | "getAllClassLevelsOfASchool";

const rawSuperAdminRoutes: Record<ISuperAdminApi, string> = {
  createPaymentPriority: "/payments/create-payment-priority",
  createClassLevels: "/school/create-school-class-levels",
  createResultSettingInASchool: "/school/create-result-setting",
  getAllClassLevelsOfASchool: "/classes/get-school-class-level",
};

// Use the function to create routes with the base path
export const superAdminRoutes: Record<ISuperAdminApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawSuperAdminRoutes,
);
