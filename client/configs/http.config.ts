import { QueryClient } from "@tanstack/react-query";
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  HttpStatusCode,
  AxiosRequestConfig,
} from "axios";
import { STORE_KEYS } from ".";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { authRoutes } from "@/constants/routes";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

class HttpClient {
  private static client: AxiosInstance;
  private static queryClient: QueryClient | null = null;

  static initialize() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      withCredentials: false,
      // headers: {
      //   "Content-Type": "application/json",
      // },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.client.interceptors.request.use(
      (config) => {
        const storedData = this.getStoredData();
        const accessToken = storedData[STORE_KEYS.USER_ACCESS_TOKEN];
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => this.handleErrorResponse(error)
    );
  }

  static setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  static getClient(): AxiosInstance {
    if (!this.client) this.initialize();
    return this.client;
  }

  private static getStoredData() {
    return StorageUtilsHelper.getItemsFromLocalStorage([
      STORE_KEYS.USER_ACCESS_TOKEN,
      STORE_KEYS.USER_REFRESH_TOKEN,
    ]);
  }

  private static async handleErrorResponse(error: AxiosError) {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const tokens = this.getStoredData();
      const refreshToken = tokens[STORE_KEYS.USER_REFRESH_TOKEN];
      if (!refreshToken) {
        this.clearUserData();
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${authRoutes.refreshToken}`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data?.responseData;

        this.storeAuthData({ accessToken, refreshToken: newRefreshToken });

        if (this.queryClient) {
          console.log("🔄 Invalidating user query after token refresh...");
          await this.queryClient.invalidateQueries({ queryKey: ["user"] });
        }

        this.client.defaults.headers.Authorization = `Bearer ${accessToken}`;
        return this.client(originalRequest);
      } catch (refreshError) {
        this.clearUserData();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }

  private static clearUserData() {
    StorageUtilsHelper.deleteFromLocalStorage([
      STORE_KEYS.USER_ACCESS_TOKEN,
      STORE_KEYS.USER_REFRESH_TOKEN,
    ]);
  }

  private static storeAuthData(data: {
    accessToken: string;
    refreshToken: string;
  }) {
    StorageUtilsHelper.saveToLocalStorage(
      [STORE_KEYS.USER_ACCESS_TOKEN, data.accessToken],
      [STORE_KEYS.USER_REFRESH_TOKEN, data.refreshToken]
    );
  }
}

export { HttpClient };
