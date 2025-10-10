import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IAuthApi =
  | "signIn"
  | "signUp"
  | "confirmEmail"
  | "resendConfirmationEmail"
  | "forgotPassword"
  | "resetPassword"
  | "refreshToken"
  | "changePassword";

const rawAuthRoutes: Record<IAuthApi, string> = {
  signIn: "/auth/signin",
  signUp: "/auth/signup",
  confirmEmail: "/auth/confirm-email",
  resendConfirmationEmail: "/auth/resend-confirmation-email",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  refreshToken: "/auth/refresh-token",
  changePassword: "/auth/change-password",
};

// Use the function to create routes with the base path
export const authRoutes: Record<IAuthApi, string> = RouteHelper.createRoutes(
  BACKEND_SVC_PATH,
  rawAuthRoutes
);
