import { HttpClient } from "@/configs";
import { fileRoutes } from "@/constants/routes";

export class FileApiService {
  static async uploadFile(payload: FormData) {
    const response = await HttpClient.getClient().post(
      `${fileRoutes.upload}`,
      payload
    );
    return response.data;
  }

  static async getFiles(queryParms: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getFiles}`,
      {
        params: queryParms,
      }
    );
    return response.data;
  }

  static async getLoggedInUserFiles(queryParms: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getLoggedInUserFiles}`,
      { params: queryParms }
    );
    return response.data?.responseData;
  }

  static async getFileById(fileId: number) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getById}/${fileId}`
    );
    return response.data;
  }

  static async deleteFile(fileId: number) {
    const response = await HttpClient.getClient().delete(
      `${fileRoutes.deleteById}/${fileId}`
    );
    return response.data;
  }

  static async deleteUserFiles(userId: number) {
    const response = await HttpClient.getClient().delete(
      `${fileRoutes.deleteUserFiles}/${userId}`
    );
    return response.data;
  }
}
