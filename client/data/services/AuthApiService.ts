import { HttpClient, STORE_KEYS } from "@/configs";
import {
  ForgotPasswordDto,
  SigninDto,
  ResendEmailVerificationDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from "../dtos";
import { authRoutes } from "@/constants/routes";
import { StorageUtilsHelper } from "@/utils";

export class AuthApiService {
  static async signIn(requestBody: SigninDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.signIn}`,
      requestBody
    );

    try {
      StorageUtilsHelper.saveToLocalStorage([STORE_KEYS.HAS_SESSION_KEY, "1"]);
      window.dispatchEvent(new Event("sessionHandledReset"));
      HttpClient.resetSessionExpiredFlag();
    } catch {}

    return response.data;
  }

  static async signUp<T>(requestBody: T) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.signUp}`,
      requestBody
    );
    return response.data;
  }

  static async signOut() {
    try {
      const response = await HttpClient.getClient().post(
        `${authRoutes.signOut}`
      );

      try {
        StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
        window.dispatchEvent(new Event("sessionHandledReset"));
        HttpClient.resetSessionExpiredFlag();
      } catch {}

      return response.data;
    } catch (error) {
      try {
        StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
        window.dispatchEvent(new Event("sessionHandledReset"));
        HttpClient.resetSessionExpiredFlag();
      } catch {}
      throw error;
    }
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

  static async changePassword(requestBody: ChangePasswordDto) {
    const response = await HttpClient.getClient().post(
      `${authRoutes.changePassword}`,
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
