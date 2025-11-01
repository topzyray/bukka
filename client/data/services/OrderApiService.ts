import { HttpClient } from "@/configs";

export class OrderApiService {
  static async createOrder(requestBody: any) {
    const response = await HttpClient.getClient().post(`${""}`, requestBody);
    return response?.data;
  }

  static async getOrders() {
    const response = await HttpClient.getClient().get(`${""}`);
    return response?.data;
  }

  static async getOrderById(id: number) {
    const response = await HttpClient.getClient().get(`${""}/${id}`);
    return response?.data;
  }

  static async updateOrder(requestBody: any) {
    const response = await HttpClient.getClient().put(`${""}`, requestBody);
    return response?.data;
  }

  static async deleteOrder(id: number) {
    const response = await HttpClient.getClient().delete(`${""}/${id}`);
    return response?.data;
  }
}
