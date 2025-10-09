import { BackendUrlEnum } from "@/server/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserApi =
  | "getUsers"
  | "getUserById"
  | "updateUser"
  | "updateUserProfile"
  | "deleteUser";

const rawAuthRoutes: Record<IUserApi, string> = {
  getUsers: "/users",
  getUserById: "/users",
  updateUser: "/users",
  updateUserProfile: "/users",
  deleteUser: "/users/profile",
};

export const userRoutes: Record<IUserApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawAuthRoutes
);
