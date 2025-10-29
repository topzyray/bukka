import { HttpClient } from "@/configs";
import { userManagementRoutes } from "@/constants/routes";

export class UserManagementApiService {
  static async adminGetAllUsers(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${userManagementRoutes.adminGetAllUsers}`,
      { params }
    );
    return response.data?.responseData;
  }
}
