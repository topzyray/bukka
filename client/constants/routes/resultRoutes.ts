import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IResultApi =
  | "getResultSetting"
  | "recordStudentScorePerTerm"
  | "recordAllStudentsScoresPerTerm"
  | "getStudentTermResultInASchool"
  | "subjectPositionGradingInClassInASchool"
  | "recordAllStudentsLastTermCumPerTermInASchool"
  | "generateClassPositionForStudents"
  | "getAllResultsOfAStudent"
  | "getStudentResultByResultIdInASchool"
  | "getAllSubjectResultOfStudentsInClass"
  | "getLevelResultSetting"
  | "recordAllStudentsExamScoresPerTerm";

const rawResultRoutes: Record<IResultApi, string> = {
  getResultSetting: "/results/get-result-setting-in-a-school",
  recordStudentScorePerTerm: "/results/record-student-score-per-term",
  recordAllStudentsScoresPerTerm: "/results/record-all-students-score-per-term",
  getStudentTermResultInASchool: "/results/get-student-term-result",
  subjectPositionGradingInClassInASchool: "/results/subject-position-grading-in-class",
  recordAllStudentsLastTermCumPerTermInASchool: "/results/record-all-students-last-term-cum",
  generateClassPositionForStudents: "/results/students-class-position",
  getAllResultsOfAStudent: "/results/get-all-results-of-a-student",
  getStudentResultByResultIdInASchool: "/results/get-student-result-by-result_id",
  getAllSubjectResultOfStudentsInClass: "/results/get-all-scores-per-subject",
  getLevelResultSetting: "/results/get-level-result-setting-in-a-school",
  recordAllStudentsExamScoresPerTerm: "/results/record-all-students-exam-score-per-term",
};

// Use the function to create routes with the base path
export const resultRoutes: Record<IResultApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawResultRoutes,
);
