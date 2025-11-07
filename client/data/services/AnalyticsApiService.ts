import { HttpClient } from "@/configs";
import { analyticsRoutes } from "@/constants/routes";

export class AnalyticsApiService {
  static async userActivitySummary() {
    const response = await HttpClient.getClient().get(
      `${analyticsRoutes.userActivitySummary}`
    );
    return response.data;
  }

  static async adminOverview() {
    const response = await HttpClient.getClient().get(
      `${analyticsRoutes.adminOverview}`
    );
    return response.data;
  }
}
