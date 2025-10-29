import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserManagementApi =
  | "createAdminAccount"
  | "adminGetAllUsers"
  | "adminGetUserById"
  | "adminGetUsersOverview"
  | "adminUpdateUser"
  | "adminDeleteUser";

const rawUserManagementRoutes: Record<IUserManagementApi, string> = {
  createAdminAccount: "/admin/users",
  adminGetAllUsers: "/admin/users",
  adminGetUserById: "/admin/users",
  adminGetUsersOverview: "/admin/users",
  adminUpdateUser: "/admin/users",
  adminDeleteUser: "/admin/users",
};

export const userManagementRoutes: Record<IUserManagementApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawUserManagementRoutes);
