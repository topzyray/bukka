import { HttpClient } from "@/configs";
import { UpdateUserDto } from "../dtos";
import { userRoutes } from "@/constants/routes";

export class UserApiService {
  static async adminGetUsers(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${userRoutes.adminGetUsers}`,
      { params }
    );
    return response.data;
  }

  static async adminGetUserById(userId: number) {
    const response = await HttpClient.getClient().get(
      `${userRoutes.getUserById}/${userId}`
    );
    return response.data;
  }

  static async getLoggedInUser() {
    const response = await HttpClient.getClient().get(
      `${userRoutes.getLoggedInUser}`
    );
    return response.data?.responseData;
  }

  static async getOnboardingProgress() {
    const response = await this.getLoggedInUser();
    return response?.onboardingProgress;
  }

  static async completeProfileOnboarding() {
    const response = await HttpClient.getClient().put(
      `${userRoutes.completeOnboarding}`
    );
    return response.data;
  }

  static async updateUser(payload: UpdateUserDto) {
    const response = await HttpClient.getClient().put(
      `${userRoutes.updateUser}`,
      payload
    );
    return response.data;
  }

  static async updateUserProfile(payload: UpdateUserDto) {
    const response = await HttpClient.getClient().put(
      `${userRoutes.updateUserProfile}`,
      payload
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
