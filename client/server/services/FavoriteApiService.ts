import { HttpClient } from "@/configs";
import { favoriteRoutes } from "@/constants/routes";
import { ToggleFavoriteDto } from "../dtos";

export class FavoriteApiService {
  static async toggleFavorite(requestBody: ToggleFavoriteDto) {
    const response = await HttpClient.getClient().put(
      `${favoriteRoutes.toggleFavorite}`,
      requestBody
    );
    return response?.data;
  }

  static async getLoggedinUserFavorites() {
    const response = await HttpClient.getClient().get(
      `${favoriteRoutes.getLoggedinUserFavorites}`
    );
    return response?.data;
  }

  static async deleteFavoriteByBusinessId(businessId: number) {
    const response = await HttpClient.getClient().delete(
      `${favoriteRoutes.deleteFavoriteByBusinessId}/${businessId}`
    );
    return response?.data;
  }
}
