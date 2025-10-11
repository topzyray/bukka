import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFileApi =
  | "upload"
  | "uploadMultipleFromUrls"
  | "getFiles"
  | "getById"
  | "getLoggedInUserFiles"
  | "deleteById"
  | "getByReferenceId"
  | "getByReferenceIdAnType"
  | "deleteUserFiles";

const rawAuthRoutes: Record<IFileApi, string> = {
  upload: "/files/upload",
  uploadMultipleFromUrls: "/files/upload-multiple-from-urls",
  getById: "/files",
  getFiles: "/files",
  getLoggedInUserFiles: "/files/my-files",
  deleteById: "/files",
  getByReferenceId: "/files/reference",
  getByReferenceIdAnType: "/files/reference",
  deleteUserFiles: "/files/user",
};

export const fileRoutes: Record<IFileApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawAuthRoutes
);
