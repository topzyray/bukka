import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ITeacherApi =
  | "assignTeacherToSubject"
  | "assignTeacherToClass"
  | "changeSubjectTeacherInClass"
  | "changeClassTeacher"
  | "getTeacherById"
  | "getTeachersBySubjectId"
  | "getTeachers"
  | "onboardTeacherById"
  | "getAllClassesTeacherTeachesByTeacherId"
  | "getStudentsInClassOfferingTeacherSubject"
  | "getStudentsInClassThatTeacherManagesInASchool"
  | "getClassTeacherManages";

const rawTeacherRoutes: Record<ITeacherApi, string> = {
  assignTeacherToSubject: "/teachers/assign-teacher-to-subject",
  assignTeacherToClass: "/teachers/assign-class-teacher",
  changeSubjectTeacherInClass: "/teachers/change-subject-teacher-in-a-class",
  changeClassTeacher: "/teachers/change-class-teacher",
  getTeacherById: "/teachers/get-a-teacher-by-id",
  getTeachersBySubjectId: "/teachers/get-all-teachers-by-subject",
  getTeachers: "/teachers/get-all-teachers",
  onboardTeacherById: "/teachers/teacher-onboarding",
  getAllClassesTeacherTeachesByTeacherId: "/teachers/get-all-classes-teacher-teaches",
  getStudentsInClassOfferingTeacherSubject: "/teachers/get-students-in-class-offering-subject",
  getClassTeacherManages: "/teachers/get-class-teacher-manages-by-teacher-id",
  getStudentsInClassThatTeacherManagesInASchool:
    "/teachers/get-all-students-in-class-that-teacher-manages",
};

// Use the function to create routes with the base path
export const teacherRoutes: Record<ITeacherApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawTeacherRoutes,
);
