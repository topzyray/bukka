import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISchoolApi = "uploadSchoolLogo" | "uploadSchoolImage" | "getASchoolBySubdomain";

const rawSchoolRoutes: Record<ISchoolApi, string> = {
  uploadSchoolLogo: "/schools/add-school-logo",
  uploadSchoolImage: "/schools/add-school-image",
  getASchoolBySubdomain: "/schools/get-school-by-subdomain",
};

// Use the function to create routes with the base path
export const schoolRoutes: Record<ISchoolApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawSchoolRoutes,
);
