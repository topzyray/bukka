import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISubjectApi =
  | "createASubject"
  | "addSubjectToClass"
  | "getASubjectById"
  | "getAllSubjects"
  | "getAllClassSubjectsByClassId";

const rawStudentRoutes: Record<ISubjectApi, string> = {
  createASubject: "/subjects/create-a-subject",
  addSubjectToClass: "/classes/add-subjects-to-class",
  getASubjectById: "/subjects/get-a-subject",
  getAllSubjects: "/subjects/get-all-subjects",
  getAllClassSubjectsByClassId: "/subjects/get-all-class-subjects",
};

// Use the function to create routes with the base path
export const subjectRoutes: Record<ISubjectApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawStudentRoutes,
);
