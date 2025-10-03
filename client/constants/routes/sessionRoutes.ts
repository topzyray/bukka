import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type ISessionApi =
  | "createNewSessionForASchool"
  | "createNewTermForASchool"
  | "getASessionBySessionIdForASchool"
  | "getSchoolActiveSession"
  | "getAllSessionsForASchool"
  | "endATermInASessionByTermIdForASchool"
  | "endASessionBySessionIdForASchool"
  | "deleteSessionByIdForASchool"
  | "deleteTermByIdForASchool";

const rawSessionRoutes: Record<ISessionApi, string> = {
  createNewSessionForASchool: "/sessions/create-session",
  createNewTermForASchool: "/sessions",
  getASessionBySessionIdForASchool: "/sessions/get-session",
  getSchoolActiveSession: "/sessions/get-active-session",
  getAllSessionsForASchool: "/sessions/get-sessions",
  endATermInASessionByTermIdForASchool: "/sessions/end-term",
  endASessionBySessionIdForASchool: "/sessions/end-session",
  deleteSessionByIdForASchool: "/sessions/delete-session",
  deleteTermByIdForASchool: "/sessions",
};

// Use the function to create routes with the base path
export const sessionRoutes: Record<ISessionApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawSessionRoutes,
);
