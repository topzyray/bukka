import { HttpClient } from "@/configs";
import { locationRoutes } from "@/constants/routes/locationRoutes";

export class LocationApiService {
  static async getLocations(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${locationRoutes.getLocations}`,
      { params }
    );
    return response.data;
  }

  static async searchPlaces(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${locationRoutes.searchPlaces}`,
      { params }
    );
    return response.data?.responseData;
  }

  static async reverseGeocode(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${locationRoutes.reverseGeocode}`,
      { params }
    );
    return response.data;
  }
}
