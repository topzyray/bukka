import { HttpClient } from "@/configs";
import { reviewRoutes } from "@/constants/routes";
import { CreateReviewDto, UpdateReviewDto } from "../dtos";

export class ReviewApiService {
  static async addReview(requestBody: CreateReviewDto) {
    const response = await HttpClient.getClient().post(
      `${reviewRoutes.addReview}`,
      requestBody
    );
    return response?.data;
  }

  static async getReviewById(reviewId: number) {
    const response = await HttpClient.getClient().get(
      `${reviewRoutes.getReviewById}/${reviewId}`
    );
    return response?.data;
  }

  static async getReviewByBusinessId(businessId: number) {
    const response = await HttpClient.getClient().get(
      `${reviewRoutes.getReviewByBusinessId}/${businessId}`
    );
    return response?.data;
  }

  static async updateReview(requestBody: UpdateReviewDto) {
    const response = await HttpClient.getClient().put(
      `${reviewRoutes.updateReview}`,
      requestBody
    );
    return response?.data;
  }

  static async deleteReview(reviewId: number) {
    const response = await HttpClient.getClient().delete(
      `${reviewRoutes.deleteReview}/${reviewId}`
    );
    return response?.data;
  }
}
