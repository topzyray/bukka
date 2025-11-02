import { HttpClient } from "@/configs";
import { businessRoutes } from "@/constants/routes";
import { CreateBusinessDto, UpdateBusinessDto } from "../dtos";

export class BusinessApiService {
  static async createBusiness(payload: CreateBusinessDto) {
    const response = await HttpClient.getClient().post(
      `${businessRoutes.createBusiness}`,
      payload
    );
    return response.data;
  }

  static async getBusinesses(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${businessRoutes.getBusinesses}`,
      { params }
    );
    return response.data;
  }

  static async getLoggedInVendorBusinesses(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${businessRoutes.getLoggedInVendorBusinesses}`,
      { params }
    );
    return response.data;
  }

  static async getBusinessById(businessId: number) {
    const response = await HttpClient.getClient().get(
      `${businessRoutes.getBusinessById}/${businessId}`
    );
    return response.data;
  }

  static async updateBusiness(businessId: number, payload: UpdateBusinessDto) {
    const response = await HttpClient.getClient().put(
      `${businessRoutes.updateBusiness}/${businessId}`,
      payload
    );
    return response.data;
  }

  static async deleteBusiness(businessId: number) {
    const response = await HttpClient.getClient().delete(
      `${businessRoutes.deleteBusiness}/${businessId}`
    );
    return response.data;
  }
}
