import { HttpClient } from "@/configs";
import { claimRoutes } from "@/constants/routes";
import { CreateClaimDto } from "../dtos";

export class ClaimApiService {
  static async createClaim(payload: CreateClaimDto) {
    const response = await HttpClient.getClient().post(
      `${claimRoutes.createClaim}`,
      payload
    );
    return response.data;
  }

  static async getClaims(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${claimRoutes.getClaims}`,
      { params }
    );
    return response.data;
  }

  static async getLoggedInUserClaims(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${claimRoutes.getLoggedInUserClaims}`,
      { params }
    );
    return response.data;
  }

  static async getClaimById(claimId: number) {
    const response = await HttpClient.getClient().get(
      `${claimRoutes.getClaimById}/${claimId}`
    );
    return response.data;
  }

  static async approveClaim(claimId: number) {
    const response = await HttpClient.getClient().put(
      `${claimRoutes.approveClaim}/${claimId}/approve`
    );
    return response.data;
  }

  static async rejectClaim(claimId: number) {
    const response = await HttpClient.getClient().put(
      `${claimRoutes.rejectClaim}/${claimId}/reject`
    );
    return response.data;
  }

  static async deleteClaim(claimId: number) {
    const response = await HttpClient.getClient().delete(
      `${claimRoutes.deleteClaim}/${claimId}`
    );
    return response.data;
  }
}
