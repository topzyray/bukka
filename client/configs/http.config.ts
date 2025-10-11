import { QueryClient } from "@tanstack/react-query";
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  HttpStatusCode,
} from "axios";
import { envConfig } from "./env.config";
import { authRoutes } from "@/constants/routes";
import { AuthApiService } from "@/server/services";
import { toast } from "sonner";
import { STORE_KEYS } from "./store.config";
import { StorageUtilsHelper } from "@/utils";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

class HttpClient {
  private static client: AxiosInstance;
  private static queryClient: QueryClient | null = null;
  private static sessionExpiredFired = false;

  static initialize() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      withCredentials: true,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => this.handleErrorResponse(error)
    );
  }

  static setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  static resetSessionExpiredFlag() {
    this.sessionExpiredFired = false;
  }

  static getClient(): AxiosInstance {
    if (!this.client) this.initialize();
    return this.client;
  }

  private static async handleErrorResponse(error: AxiosError) {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const status = error.response?.status;

    const isRefreshRequest =
      originalRequest?.url?.endsWith("/refresh-token") ?? false;

    if (
      status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      const hadSession =
        StorageUtilsHelper.getItemFromLocalStorage(
          STORE_KEYS.HAS_SESSION_KEY
        ) === "1";

      if (!hadSession) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await axios.post(
          `${envConfig.NEXT_PUBLIC_API_BASE_URL}${authRoutes.refreshToken}`,
          {},
          { withCredentials: true }
        );

        try {
          StorageUtilsHelper.saveToLocalStorage([
            STORE_KEYS.HAS_SESSION_KEY,
            "1",
          ]);
        } catch {}

        if (this.queryClient) {
          await this.queryClient.invalidateQueries({
            queryKey: ["currentUser"],
          });
        }
        return this.client(originalRequest);
      } catch (error) {
        try {
          await AuthApiService.signOut();
        } catch {}

        if (this.queryClient) {
          this.queryClient.clear();
        }

        let hadSession = false;
        try {
          hadSession =
            StorageUtilsHelper.getItemFromLocalStorage(
              STORE_KEYS.HAS_SESSION_KEY
            ) === "1";
        } catch {}

        if (hadSession && !HttpClient.sessionExpiredFired) {
          HttpClient.sessionExpiredFired = true;

          toast.error("Your session has expired. Please sign in again.");

          const sessionEvent = new CustomEvent("sessionExpired", {
            detail: { reason: "refresh_token_failed", time: new Date() },
          });
          window.dispatchEvent(sessionEvent);
        }

        try {
          StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.HAS_SESSION_KEY);
        } catch {}

        return Promise.reject(error);
      }
    }

    if (error.response?.status === HttpStatusCode.Forbidden) {
      toast.error("You do not have permission to perform this action.");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
}

export { HttpClient };
