import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IClassEnrollmentApi =
  | "enrollStudentToAClassInASchool"
  | "enrollManyStudentsToClassInASchool"
  | "getASingleEnrollmentByIdInASchool"
  | "getAllEnrollmentsInASchool"
  | "getAllActiveClassEnrollmentsInASchool"
  | "getAllSessionEnrollmentsBySessionIdInASchool"
  | "getAllStudentsInAClassInASchool"
  | "getAllStudentsInAClassInActiveSessionInASchool";

const rawClassEnrollmentRoutes: Record<IClassEnrollmentApi, string> = {
  enrollStudentToAClassInASchool: "/class-enrollment/enrol-student-to-class",
  enrollManyStudentsToClassInASchool: "/class-enrollment/enrol-many-students-to-class",
  getASingleEnrollmentByIdInASchool: "/class-enrollment/get-a-single-class-enrollment",
  getAllEnrollmentsInASchool: "/class-enrollment/get-all-class-enrollments",
  getAllActiveClassEnrollmentsInASchool: "/class-enrollment/get-all-active-class-enrollments",
  getAllSessionEnrollmentsBySessionIdInASchool: "/class-enrollment/get-all-class-enrollments",
  getAllStudentsInAClassInASchool: "/class-enrollment/get-all-students-in-a-class",
  getAllStudentsInAClassInActiveSessionInASchool:
    "/class-enrollment/get-all-students-in-a-class-in-active-session",
};

// Use the function to create routes with the base path
export const classEnrollmentRoutes: Record<IClassEnrollmentApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawClassEnrollmentRoutes,
);
