import { HttpClient } from "@/configs";
import { placeAdminRoutes } from "@/constants/routes/placeAdminRoutes";
import { PlaceImportDto } from "../dtos/PlaceAdminDto";

export class PlaceAdminApiService {
  static async searchPlace(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${placeAdminRoutes.searchPlace}`,
      { params }
    );
    return response?.data;
  }

  static async importOne(payload: PlaceImportDto) {
    const response = await HttpClient.getClient().post(
      `${placeAdminRoutes.importOne}`,
      payload
    );
    return response?.data;
  }

  static async importMany(payload: PlaceImportDto) {
    const response = await HttpClient.getClient().post(
      `${placeAdminRoutes.importMany}`,
      payload
    );
    return response?.data;
  }
}
