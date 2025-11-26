import { STORE_KEYS } from "@/configs";
import { TokenEncryptionHelper } from "./token-encryption-utils";

export class StorageUtilsHelper {
  static saveToLocalStorage(...args: [string, any][]) {
    args.forEach(([key, value]) => {
      if (
        key === STORE_KEYS.USER_ACCESS_TOKEN ||
        key === STORE_KEYS.USER_REFRESH_TOKEN
      ) {
        const encryptedValue = TokenEncryptionHelper.encryptToken(value);
        localStorage.setItem(key, encryptedValue);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }

  static getTokensFromLocalStorage() {
    if (typeof window === "undefined") {
      console.log("Server environment — skip localStorage");
      return null;
    }

    const encryptedAccessToken = localStorage.getItem(
      STORE_KEYS.USER_ACCESS_TOKEN
    );
    const encryptedRefreshToken = localStorage.getItem(
      STORE_KEYS.USER_REFRESH_TOKEN
    );

    return {
      accessToken: encryptedAccessToken
        ? TokenEncryptionHelper.decryptToken(encryptedAccessToken)
        : null,
      refreshToken: encryptedRefreshToken
        ? TokenEncryptionHelper.decryptToken(encryptedRefreshToken)
        : null,
    };
  }

  static getItemFromLocalStorage<T>(
    key: string,
    decrypt: boolean = true
  ): T | null {
    if (typeof window === "undefined") {
      console.log("Server environment — skip localStorage");
      return null;
    }

    const item = localStorage.getItem(key);

    if (!item) return null;

    if (
      decrypt &&
      (key.includes(STORE_KEYS.USER_ACCESS_TOKEN) ||
        key.includes(STORE_KEYS.USER_REFRESH_TOKEN))
    ) {
      return TokenEncryptionHelper.decryptToken(item) as T;
    }

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  }

  static getItemsFromLocalStorage<T>(
    keys: string[],
    decrypt: boolean = true
  ): Record<string, T | null> {
    const result: Record<string, T | null> = {};

    keys.forEach((key) => {
      const item = localStorage.getItem(key);

      if (item) {
        if (
          decrypt &&
          key.includes(
            STORE_KEYS.USER_ACCESS_TOKEN || STORE_KEYS.USER_REFRESH_TOKEN
          )
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
}
