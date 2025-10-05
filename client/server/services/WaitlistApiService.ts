import { HttpClient } from "@/configs/http.config";
import { JoinWaitlistDto } from "../dtos/WaitlistDto";
import { waitlistRoutes } from "@/constants/routes/waitlistRoutes";

export class WaitlistApiService {
  static async joinWaitlist(requestBody: JoinWaitlistDto) {
    const response = await HttpClient.getClient().post(
      `${waitlistRoutes.joinWaitlist}`,
      requestBody
    );
    return response.data;
  }

  static async getWaitlistById(waitlistId: number) {
    const response = await HttpClient.getClient().get(
      `${waitlistRoutes.getWaitlist}/${waitlistId}`
    );
    return response.data;
  }

  static async getWaitlistByFilters(queryParams: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${waitlistRoutes.getWaitlist}`,
      { params: queryParams }
    );
    return response.data;
  }
}
