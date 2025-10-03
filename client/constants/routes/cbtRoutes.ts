import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ICbtApi =
  | "createTermExamDocumentInASchool"
  | "setSubjectCbtObjQuestionsForAClassInASchool"
  | "createTermClassExamTimetableInASchool"
  | "getTermCbtAssessmentDocumentInASchool"
  | "startSubjectCbtObjCbtAssessmentForAClass"
  | "classTeacherAuthorizeStudentsToWriteSubjectCbtInASchool"
  | "updateSubjectCbtObjExamForAClassInASchool"
  | "updateSubjectCbtObjExamRemainingTimeForAClassInASchool"
  | "submitSubjectCbtObjExamForAClassInASchool"
  | "createCutoffMinutesForASchool"
  | "getTermClassExamTimetable"
  | "getAllAssessmentDocument"
  | "getAssessmentDocumentById"
  | "getAllClassCbtAssessmentTimetables";

const rawCbtRoutes: Record<ICbtApi, string> = {
  createTermExamDocumentInASchool: "/cbt/create-term-exam-document",
  setSubjectCbtObjQuestionsForAClassInASchool: "/cbt/set-obj-questions",
  createTermClassExamTimetableInASchool: "/cbt/create-term-class-exam-timetable",
  getTermCbtAssessmentDocumentInASchool: "/cbt/get-term-exam-document",
  startSubjectCbtObjCbtAssessmentForAClass: "/cbt/start-obj-exam",
  classTeacherAuthorizeStudentsToWriteSubjectCbtInASchool:
    "/cbt/class-teacher-authorize-students-to-do-subject-cbt",
  updateSubjectCbtObjExamForAClassInASchool: "/cbt/update-obj-exam-answers",
  updateSubjectCbtObjExamRemainingTimeForAClassInASchool: "/cbt/update-obj-exam-remaining-time",
  submitSubjectCbtObjExamForAClassInASchool: "/cbt/submit-obj-exam",
  createCutoffMinutesForASchool: "/school/create-school-cutoff-minutes",
  getTermClassExamTimetable: "/cbt/get-term-class-exam-timetable",
  getAllAssessmentDocument: "/cbt/all-exam-documents",
  getAssessmentDocumentById: "/cbt/get-exam-document-by-id",
  getAllClassCbtAssessmentTimetables: "/cbt/get-term-class-exam-timetable",
};

// Use the function to create routes with the base path
export const cbtRoutes: Record<ICbtApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawCbtRoutes,
);
