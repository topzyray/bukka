import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserApi =
  | "getUsers"
  | "getLoggedInUser"
  | "updateUser"
  | "updateUserProfile"
  | "completeOnboarding";

const rawUserRoutes: Record<IUserApi, string> = {
  getUsers: "/users",
  getLoggedInUser: "/users/me/profile",
  updateUser: "/users",
  updateUserProfile: "/users",
  completeOnboarding: "/users/profile/complete-onboarding",
};

export const userRoutes: Record<IUserApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawUserRoutes
);
