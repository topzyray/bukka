import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserApi =
  | "adminGetUsers"
  | "getUsers"
  | "getUserById"
  | "getLoggedInUser"
  | "updateUser"
  | "updateUserProfile"
  | "deleteUser"
  | "completeOnboarding";

const rawAuthRoutes: Record<IUserApi, string> = {
  adminGetUsers: "/admin/users",
  getUsers: "/users",
  getUserById: "/users",
  getLoggedInUser: "/users/me/profile",
  updateUser: "/users",
  updateUserProfile: "/users",
  deleteUser: "/users/profile",
  completeOnboarding: "/users/profile/complete-onboarding",
};

export const userRoutes: Record<IUserApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawAuthRoutes
);
