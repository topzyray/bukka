import { HttpClient } from "@/configs";
import { adminControlRoutes } from "@/constants/routes";

export class AdminControlApiService {
  static async invalidateAllCache() {
    const response = await HttpClient.getClient().delete(
      `${adminControlRoutes.invalidateAllCache}`
    );
    return response?.data;
  }
}
