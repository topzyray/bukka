import { BackendUrlEnum } from "@/api/enums/BackendUrlEnum";
import { RouteHelper } from "../../helpers/RouteHelper";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IAuthApi =
  | "login"
  | "register"
  | "verifyEmail"
  | "resendEmailVerification"
  | "forgotPassword"
  | "resetPassword"
  | "refreshToken"
  | "changePassword"
  | "logout";

const rawAuthRoutes: Record<IAuthApi, string> = {
  login: "/auth/login",
  register: "/auth/register",
  verifyEmail: "/auth/email-verification",
  resendEmailVerification: "/auth/resend-email-verification",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  refreshToken: "/auth/request-access-token",
  changePassword: "/auth/change-password",
  logout: "/auth/logout",
};

// Use the function to create routes with the base path
export const authRoutes: Record<IAuthApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawAuthRoutes,
);
