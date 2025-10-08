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
  static async signIn(requestBody: SigninDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.signIn}`,
      requestBody
    );
    return response.data;
  }

  static async signUp<T>(requestBody: T) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.signUp}`,
      requestBody
    );
    return response.data;
  }

  static async confirmEmail(token: string) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.confirmEmail}`,
      { token }
    );
    return response.data;
  }

  static async resendConfirmationEmail(
    requestBody: ResendEmailVerificationDto
  ) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.resendConfirmationEmail}`,
      requestBody
    );
    return response.data;
  }

  static async forgotPassword(requestBody: ForgotPasswordDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.forgotPassword}`,
      requestBody
    );
    return response.data;
  }

  static async resetPassword(requestBody: ResetPasswordDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.resetPassword}`,
      requestBody
    );
    return response.data;
  }

  static async refreshToken(requestBody: RefreshTokenDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.refreshToken}`,
      requestBody
    );
    return response.data;
  }
}
