import { HttpClient } from "@/configs/http.config";
import {
  ForgotPasswordDto,
  SigninDto,
  ResendEmailVerificationDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from "../dtos/AuthDto";
import { authRoutes } from "@/constants/routes/authRoutes";

export class AuthApiService {
  static async authLogin(requestBody: SigninDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.login}`,
      requestBody
    );
    return response.data;
  }

  static async authRegister<T>(requestBody: T) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.register}`,
      requestBody
    );
    return response.data;
  }

  static async authVerifyEmail(token: string) {
    const response = await HttpClient.getClient().get(
      `${authRoutes.verifyEmail}/${token}`
    );
    return response.data;
  }

  static async authResendEmailVerification(
    requestBody: ResendEmailVerificationDto
  ) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.resendEmailVerification}`,
      requestBody
    );
    return response.data;
  }

  static async authForgotPassword(requestBody: ForgotPasswordDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.forgotPassword}`,
      requestBody
    );
    return response.data;
  }

  static async authResetPassword(requestBody: ResetPasswordDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.resetPassword}`,
      requestBody
    );
    return response.data;
  }

  static async authRequestRefreshToken(requestBody: RefreshTokenDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.refreshToken}`,
      requestBody
    );
    return response.data;
  }

  static async authLogout() {
    const response = await HttpClient.getClient().post(`${authRoutes.logout}`);
    return response.data;
  }
}
