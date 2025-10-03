import { STORE_KEYS } from "@/configs/store.config";
import { TokenEncryptionHelper } from "./token-encryption-utils";

export class StorageUtilsHelper {
  static saveToLocalStorage(...args: [string, any][]) {
    args.forEach(([key, value]) => {
      if (key === STORE_KEYS.USER_ACCESS_TOKEN || key === STORE_KEYS.USER_REFRESH_TOKEN) {
        const encryptedValue = TokenEncryptionHelper.encryptToken(value);
        localStorage.setItem(key, encryptedValue);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }

  static getTokensFromLocalStorage() {
    const encryptedAccessToken = localStorage.getItem(STORE_KEYS.USER_ACCESS_TOKEN);
    const encryptedRefreshToken = localStorage.getItem(STORE_KEYS.USER_REFRESH_TOKEN);

    return {
      accessToken: encryptedAccessToken
        ? TokenEncryptionHelper.decryptToken(encryptedAccessToken)
        : null,
      refreshToken: encryptedRefreshToken
        ? TokenEncryptionHelper.decryptToken(encryptedRefreshToken)
        : null,
    };
  }

  static getItemsFromLocalStorage<T>(
    keys: string[],
    decrypt: boolean = true,
  ): Record<string, T | null> {
    const result: Record<string, T | null> = {};

    keys.forEach((key) => {
      const item = localStorage.getItem(key);

      if (item) {
        if (
          decrypt &&
          key.includes(STORE_KEYS.USER_ACCESS_TOKEN || STORE_KEYS.USER_REFRESH_TOKEN)
        ) {
          result[key] = TokenEncryptionHelper.decryptToken(item) as T;
        } else {
          try {
            result[key] = JSON.parse(item) as T;
          } catch {
            result[key] = item as T;
          }
        }
      } else {
        result[key] = null;
      }
    });

    return result;
  }

  static deleteFromLocalStorage<T>(data: T | T[]): void {
    if (Array.isArray(data)) {
      for (const key of data) {
        if (typeof key === "string") {
          localStorage.removeItem(key);
        }
      }
    } else if (typeof data === "string") {
      localStorage.removeItem(data);
    }
  }

  static getSubdomainFromHost() {
    if (typeof window === "undefined") return null;
    const host = window.location.hostname;
    const parts = host.split(".");

    if (parts.length > 1) {
      return parts[0];
    }
    return null;
  }

  getSubdomainFromCookies = (cookieHeader: string | undefined): string | null => {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").reduce(
      (acc, curr) => {
        const [key, val] = curr.trim().split("=");
        acc[key] = val;
        return acc;
      },
      {} as Record<string, string>,
    );

    return cookies["school"] || null;
  };
}
