import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISchoolAdminApi =
  | "getAdminByAdminIdInMySchool"
  | "getAllAdminsInMySchool"
  | "adminUpdateStudentSessionSubscriptionInASchool"
  | "getMySchoolSummary";

const rawSchoolAdminRoutes: Record<ISchoolAdminApi, string> = {
  getAdminByAdminIdInMySchool: "/school-admin/get-admin",
  getAllAdminsInMySchool: "/school-admin/get-all-admins",
  adminUpdateStudentSessionSubscriptionInASchool:
    "/students/update-student-to-subscribe-to-new-session",
  getMySchoolSummary: "/school-admin/get-my-school-summary",
};

// Use the function to create routes with the base path
export const schoolAdminRoutes: Record<ISchoolAdminApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawSchoolAdminRoutes,
);
