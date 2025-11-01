import { HttpClient } from "@/configs";
import { notificationSettingRoutes } from "@/constants/routes";

export class NotificationSettingApiService {
  static async getMyNotificationSetting() {
    const response = await HttpClient.getClient().get(
      `${notificationSettingRoutes.getMyNotificationSetting}`
    );
    return response.data;
  }

  static async updateMyNotificationSetting(payload: Record<string, any>) {
    const response = await HttpClient.getClient().put(
      `${notificationSettingRoutes.updateMyNotificationSetting}`,
      payload
    );
    return response.data;
  }
}
