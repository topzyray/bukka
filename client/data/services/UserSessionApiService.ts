import { HttpClient } from "@/configs";
import { userSessionRoutes } from "@/constants/routes";

export class UserSessionApiService {
  static async getLoggedUserSession() {
    const response = await HttpClient.getClient().get(
      `${userSessionRoutes.getLoggedUserSession}`
    );
    return response.data;
  }

  static async getUserActiveSession(payload: {
    userId: number;
    deviceId: string;
  }) {
    const response = await HttpClient.getClient().get(
      `${userSessionRoutes.getUserActiveSession}?userId=${payload?.userId}&deviceId=${payload?.deviceId}`
    );
    return response.data;
  }

  static async deleteSessionById(userId: number) {
    const response = await HttpClient.getClient().delete(
      `${userSessionRoutes.deleteSessionById}/${userId}`
    );
    return response.data;
  }
}
