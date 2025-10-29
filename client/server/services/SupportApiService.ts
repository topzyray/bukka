import { HttpClient } from "@/configs";
import { CreateSupportTicketDto } from "../dtos";
import { supportRoutes } from "@/constants/routes";

export class SupportApiService {
  async createTicket(requestBody: CreateSupportTicketDto) {
    const response = await HttpClient.getClient().post(
      `${supportRoutes.createTicket}`,
      requestBody
    );
    return response?.data;
  }

  async getSupportByTicketId(supportId: number) {
    const response = await HttpClient.getClient().get(
      `${supportRoutes.getSupportByTicketId}/${supportId}`
    );
    return response?.data;
  }

  async getSupport(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${supportRoutes.getSupport}`,
      params
    );
    return response?.data;
  }

  async deleteSupport(supportId: number) {
    const response = await HttpClient.getClient().delete(
      `${supportRoutes.deleteSupport}/${supportId}`
    );
    return response?.data;
  }
}
