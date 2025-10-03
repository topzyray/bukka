import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IStudentApi =
  | "linkSchoolStudentWithParent"
  | "studentsSubscribeToNewSessionInASchool"
  | "getAStudentByIdInASchool"
  | "getAllStudentsInASchool"
  | "getStudentsSubscribedToNewSessionInASchool"
  | "getNewStudentsWithoutClassEnrolmentBeforeInASchool"
  | "getAllStudentsOnAClassLevelInASchool"
  | "updateStudentDetailsInASchool"
  | "updateStudentSessionSubscriptionInASchool"
  | "getStudentsThatAreYetToSubscribedToNewSession"
  | "provisionAccount";

const rawStudentRoutes: Record<IStudentApi, string> = {
  linkSchoolStudentWithParent: "/students/link-student",
  studentsSubscribeToNewSessionInASchool: "/students/notify-students-to-subscribe-to-new-session",
  getAStudentByIdInASchool: "/students/get-a-student",
  getAllStudentsInASchool: "/students/get-all-students",
  getStudentsSubscribedToNewSessionInASchool:
    "/students/get-students-that-subscribed-to-new-session",
  getNewStudentsWithoutClassEnrolmentBeforeInASchool: "/students/get-new-students",
  getAllStudentsOnAClassLevelInASchool: "/students/get-all-student-using-class-level",
  updateStudentDetailsInASchool: "/students/update-student-details",
  updateStudentSessionSubscriptionInASchool: "/students/update-student-to-subscribe-to-new-session",
  getStudentsThatAreYetToSubscribedToNewSession:
    "/students/get-students-yet-to-subscribe-to-new-session",
  provisionAccount: "/students/provision-account",
};

// Use the function to create routes with the base path
export const studentRoutes: Record<IStudentApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawStudentRoutes,
);
