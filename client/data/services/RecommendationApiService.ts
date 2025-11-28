import { HttpClient } from "@/configs";
import { recommendationRoutes } from "@/constants/routes";
import { CreateBusinessDto, UpdateBusinessDto } from "../dtos";
import { CreateRecommendationDto } from "../dtos";

export class RecommendationApiService {
  static async createRecommenation(payload: CreateRecommendationDto) {
    const response = await HttpClient.getClient().post(
      `${recommendationRoutes.createRecommendation}`,
      payload
    );
    return response.data;
  }

  static async getRecommendations(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${recommendationRoutes.getRecommendations}`,
      { params }
    );
    return response.data;
  }

  static async getLoggedInUserRecommendations(
    params: Record<string, any> = {}
  ) {
    const response = await HttpClient.getClient().get(
      `${recommendationRoutes.getLoggedInUserRecommendations}`,
      { params }
    );
    return response.data;
  }

  static async getRecommendationById(recommendationId: number) {
    const response = await HttpClient.getClient().get(
      `${recommendationRoutes.getRecommendationById}/${recommendationId}`
    );
    return response.data;
  }

  static async approveRecommendation(recommendationId: number) {
    const response = await HttpClient.getClient().put(
      `${recommendationRoutes.approveRecommendation}/${recommendationId}/approve`
    );
    return response.data;
  }

  static async rejectRecommendation(recommendationId: number) {
    const response = await HttpClient.getClient().put(
      `${recommendationRoutes.rejectRecommendation}/${recommendationId}/reject`
    );
    return response.data;
  }

  static async deleteRecommendation(recommendationId: number) {
    const response = await HttpClient.getClient().delete(
      `${recommendationRoutes.deleteRecommendation}/${recommendationId}`
    );
    return response.data;
  }
}
