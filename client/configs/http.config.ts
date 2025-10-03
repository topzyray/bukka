import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  HttpStatusCode,
  AxiosRequestConfig,
} from "axios";
import { STORE_KEYS } from "./store.config";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { authRoutes } from "@/constants/routes/authRoutes";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

class HttpClient {
  private static client: AxiosInstance;

  static initialize() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
      },
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
      (error) => HttpClient.buildPromiseError(error),
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleErrorResponse(error);
      },
    );
  }

  private static buildPromiseError(error: Error): Promise<Error> {
    return Promise.reject(error);
  }

  static getClient(): AxiosInstance {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }

  static addHeaders(headers: Record<string, string>): void {
    this.getClient().defaults.headers = {
      ...this.getClient().defaults.headers,
      ...headers,
    };
  }

  private static getStoredData() {
    return StorageUtilsHelper.getItemsFromLocalStorage([
      STORE_KEYS.USER_ACCESS_TOKEN,
      STORE_KEYS.USER_REFRESH_TOKEN,
    ]);
  }

  private static async handleErrorResponse(error: AxiosError) {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response) {
      switch (error.response.status) {
        case HttpStatusCode.PaymentRequired:
          return await HttpClient.buildPromiseError(error);
        case HttpStatusCode.Unauthorized:
          if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const tokens = this.getStoredData();
              const refreshToken = tokens[STORE_KEYS.USER_REFRESH_TOKEN];

              if (!refreshToken) {
                this.clearUserData();

                window.location.href = "/login";
                throw new Error("No refresh token available");
              }

              const response = await axios.post(`${authRoutes.refreshToken}`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken, user } = response.data;

              if (user.school) {
                this.storeAuthData({
                  accessToken,
                  refreshToken: newRefreshToken,
                  user,
                });
              } else {
                this.storeAuthData({
                  accessToken,
                  refreshToken: newRefreshToken,
                  user,
                });
              }

              this.client.defaults.headers.Authorization = `Bearer ${accessToken}`;

              if (user.school) {
                this.client.defaults.headers.schoolid = `${user.school._id}`;
              }

              return this.client(originalRequest);
            } catch (refreshError) {
              this.clearUserData();

              return Promise.reject(refreshError);
            }
          }
          return HttpClient.buildPromiseError(error);
        case HttpStatusCode.Forbidden:
          this.clearUserData();
          window.dispatchEvent(new CustomEvent("unauthorized"));
          return await HttpClient.buildPromiseError(error);
        default:
          return await Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }

  private static clearUserData() {
    StorageUtilsHelper.deleteFromLocalStorage([
      STORE_KEYS.USER_DETAILS,
      STORE_KEYS.USER_ACCESS_TOKEN,
      STORE_KEYS.USER_REFRESH_TOKEN,
    ]);
  }

  private static storeAuthData<T>(data: { accessToken: string; refreshToken: string; user: T }) {
    StorageUtilsHelper.saveToLocalStorage(
      [STORE_KEYS.USER_ACCESS_TOKEN, data.accessToken],
      [STORE_KEYS.USER_REFRESH_TOKEN, data.refreshToken],
      [STORE_KEYS.USER_DETAILS, data.user],
    );
  }

  static readonly instantiate = () => new HttpClient();
}

export { HttpClient };
