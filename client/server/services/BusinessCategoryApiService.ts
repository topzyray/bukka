import { HttpClient } from "@/configs";
import { businessCategoryRoutes } from "@/constants/routes/businessCategoryRoutes";
import { CreateCategoryDto } from "../dtos/CategoryDto";

export class BusinessCategoryApiService {
  static async getCategories(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${businessCategoryRoutes.getCategories}`,
      { params }
    );
    return response.data;
  }

  static async createCategory(payload: CreateCategoryDto) {
    const response = await HttpClient.getClient().post(
      `${businessCategoryRoutes.getCategories}`,
      payload
    );
    return response.data;
  }
}
