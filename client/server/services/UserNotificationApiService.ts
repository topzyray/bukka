import { HttpClient } from "@/configs";
import { userNotificationRoutes } from "@/constants/routes/userNotificationRoutes";
import { NewUserNotificationDto } from "../dtos/UserNotificationDto";

export class UserNotificationApiService {
  static async createNotification(payload: NewUserNotificationDto) {
    const response = await HttpClient.getClient().post(
      `${userNotificationRoutes.createNotification}`,
      payload
    );
    return response.data;
  }

  static async readAllMyNotification() {
    const response = await HttpClient.getClient().put(
      `${userNotificationRoutes.readAllMyNotification}`
    );
    return response.data;
  }

  static async readNotificationById(notificationId: number) {
    const response = await HttpClient.getClient().put(
      `${userNotificationRoutes.readNotificationById}/${notificationId}`
    );
    return response.data;
  }

  static async getAllMyNotifications(queryParms: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${userNotificationRoutes.getAllMyNotifications}`,
      {
        params: queryParms,
      }
    );
    return response.data;
  }

  static async getNotificationById(notificationId: number) {
    const response = await HttpClient.getClient().get(
      `${userNotificationRoutes.getNotificationById}/${notificationId}`
    );
    return response.data;
  }

  static async deleteAllNofifications() {
    const response = await HttpClient.getClient().delete(
      `${userNotificationRoutes.deleteAllNofifications}`
    );
    return response.data;
  }

  static async deleteNotificationById(notificationId: number) {
    const response = await HttpClient.getClient().delete(
      `${userNotificationRoutes.deleteNotificationById}/${notificationId}`
    );
    return response.data;
  }
}
