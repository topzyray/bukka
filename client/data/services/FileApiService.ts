import { HttpClient } from "@/configs";
import { fileRoutes } from "@/constants/routes";
import { FileReferenceTypeEnum } from "../enums";

export class FileApiService {
  static async uploadFile(payload: FormData) {
    const response = await HttpClient.getClient().post(
      `${fileRoutes.uploadFile}`,
      payload
    );
    return response.data;
  }

  static async uploadMultipleFiles(payload: FormData) {
    const response = await HttpClient.getClient().post(
      `${fileRoutes.uploadMultipleFiles}`,
      payload
    );
    return response.data;
  }

  static async getFiles(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getFiles}`,
      params
    );
    return response.data;
  }

  static async getFileById(fileId: number) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getFileById}/${fileId}`
    );
    return response.data;
  }

  static async getLoggedInUserFiles(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getLoggedInUserFiles}`,
      params
    );
    return response.data?.responseData;
  }

  static async getByReferenceIdAndType(payload: {
    referenceType: FileReferenceTypeEnum;
    referenceId: number;
  }) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getByReferenceIdAndType}/${payload.referenceType}/${payload.referenceId}`
    );
    return response.data;
  }

  static async getFilesByReferenceId(referenceId: number) {
    const response = await HttpClient.getClient().get(
      `${fileRoutes.getFilesByReferenceId}/${referenceId}`
    );
    return response.data?.responseData;
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
