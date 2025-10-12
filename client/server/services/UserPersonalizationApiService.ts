import { HttpClient } from "@/configs";
import { userPersonalizationRoutes } from "@/constants/routes";
import {
  CreateUserPersonalizationDto,
  UpdateUserPersonalizationDto,
} from "../dtos/UserPersonalizationDto";

export class UserPersonalizationApiService {
  static async createUserPersonalization(
    requestBody: CreateUserPersonalizationDto
  ) {
    const response = await HttpClient.getClient().post(
      `${userPersonalizationRoutes.createUserPersonalization}`,
      requestBody
    );
    return response.data;
  }

  static async getLoggedUserPersonalization() {
    const response = await HttpClient.getClient().get(
      `${userPersonalizationRoutes.getLoggedUserPersonalization}`
    );
    return response.data;
  }

  static async getWaitlistByFilters(payload: UpdateUserPersonalizationDto) {
    const response = await HttpClient.getClient().put(
      `${userPersonalizationRoutes.updateLoggedUserPersonalization}`,
      payload
    );
    return response.data;
  }

  static async deleteLoggedUserPersonalization() {
    const response = await HttpClient.getClient().delete(
      `${userPersonalizationRoutes.deleteLoggedUserPersonalization}`
    );
    return response.data;
  }
}
