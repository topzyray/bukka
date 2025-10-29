import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IFileApi =
  | "uploadFile"
  | "uploadMultipleFiles"
  | "uploadMultipleFromUrls"
  | "getFiles"
  | "getFileById"
  | "getLoggedInUserFiles"
  | "deleteById"
  | "getFilesByReferenceId"
  | "getByReferenceIdAndType"
  | "deleteUserFiles";

const rawFileRoutes: Record<IFileApi, string> = {
  uploadFile: "/files/upload",
  uploadMultipleFiles: "/files/upload-multiple",
  uploadMultipleFromUrls: "/files/upload-multiple-from-urls",
  getFileById: "/files",
  getFiles: "/files",
  getLoggedInUserFiles: "/files/my-files",
  deleteById: "/files",
  getFilesByReferenceId: "/files/reference",
  getByReferenceIdAndType: "/files/reference",
  deleteUserFiles: "/files/user",
};

export const fileRoutes: Record<IFileApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawFileRoutes
);
