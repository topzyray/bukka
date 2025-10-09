import { HttpClient } from "@/configs/http.config";
import { userRoutes } from "@/constants/routes/userRoutes";
import { OnboardingProgressDto, UpdateUserDto } from "../dtos/UserDto";

export class UserApiService {
  static async getUsers(queryParms: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${userRoutes.getUsers}`,
      {
        params: queryParms,
      }
    );
    return response.data;
  }

  static async getUserById(userId: number) {
    const response = await HttpClient.getClient().get(
      `${userRoutes.getUserById}/${userId}`
    );
    return response.data;
  }

  static async getOnboardingProgress(userId: number) {
    const response = await this.getUserById(userId);
    return response.data.responseData.onboardingProgress ?? 0;
  }

  static async saveOnboardingProgress(payload: OnboardingProgressDto) {
    const response = await HttpClient.getClient().put(
      `${userRoutes.updateUser}/${payload.userId}`,
      { onboardingProgress: payload.stepIndex }
    );
    return response.data;
  }

  static async updateUser(payload: UpdateUserDto) {
    const { userId, ...otherData } = payload;
    const response = await HttpClient.getClient().put(
      `${userRoutes.updateUser}/${userId}`,
      otherData
    );
    return response.data;
  }

  static async updateUserProfile(payload: UpdateUserDto) {
    const { userId, ...otherData } = payload;
    const response = await HttpClient.getClient().put(
      `${userRoutes.updateUserProfile}/${userId}`,
      otherData
    );
    return response.data;
  }

  static async deleteUser(userId: number) {
    const response = await HttpClient.getClient().delete(
      `${userRoutes.deleteUser}/${userId}`
    );
    return response.data;
  }
}
