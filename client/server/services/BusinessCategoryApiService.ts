import { HttpClient } from "@/configs";
import { businessCategoryRoutes } from "@/constants/routes";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos";

export class BusinessCategoryApiService {
  static async createCategory(payload: CreateCategoryDto) {
    const response = await HttpClient.getClient().post(
      `${businessCategoryRoutes.getCategories}`,
      payload
    );
    return response.data;
  }

  static async getCategories(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${businessCategoryRoutes.getCategories}`,
      { params }
    );
    return response.data;
  }

  static async getCategoryById(categoryId: number) {
    const response = await HttpClient.getClient().get(
      `${businessCategoryRoutes.getCategoryById}/${categoryId}`
    );
    return response.data;
  }

  static async updateCategory(payload: UpdateCategoryDto) {
    const { id, ...updatePayload } = payload;
    const response = await HttpClient.getClient().put(
      `${businessCategoryRoutes.updateCategory}/${id}`,
      updatePayload
    );
    return response.data;
  }

  static async deleteCategory(categoryId: number) {
    const response = await HttpClient.getClient().delete(
      `${businessCategoryRoutes.deleteCategory}/${categoryId}`
    );
    return response.data;
  }
}
