import { HttpClient } from "@/configs";
import { AssignupportTicketDto, CreateSupportTicketDto } from "../dtos";
import { supportRoutes } from "@/constants/routes";

export class SupportApiService {
  static async createTicket(requestBody: CreateSupportTicketDto) {
    const response = await HttpClient.getClient().post(
      `${supportRoutes.createTicket}`,
      requestBody
    );
    return response?.data;
  }

  static async getSupportByTicketId(supportId: number) {
    const response = await HttpClient.getClient().get(
      `${supportRoutes.getSupportByTicketId}/${supportId}`
    );
    return response?.data;
  }

  static async getSupports(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${supportRoutes.getSupport}`,
      params
    );
    return response?.data;
  }

  static async assignTicket(requestBody: AssignupportTicketDto) {
    const response = await HttpClient.getClient().put(
      `${supportRoutes.assignTicket}`,
      requestBody
    );
    return response?.data;
  }

  static async resolveTicket(requestBody: { supportId: number }) {
    const response = await HttpClient.getClient().put(
      `${supportRoutes.resolveTicket}`,
      requestBody
    );
    return response?.data;
  }

  static async deleteSupport(supportId: number) {
    const response = await HttpClient.getClient().delete(
      `${supportRoutes.deleteSupport}/${supportId}`
    );
    return response?.data;
  }
}
