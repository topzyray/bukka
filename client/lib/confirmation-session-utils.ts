import { STORE_KEYS } from "@/configs/store.config";
import { StorageUtilsHelper } from "@/utils/storage-utils";

export interface IConfirmationSession {
  email: string;
  confirmationCodeExpires: string; // ISO date string
}

const STORAGE_KEY = STORE_KEYS.CONFIRMATION_SESSION;

export class ConfirmationSession {
  static saveConfirmationSession(session: IConfirmationSession) {
    StorageUtilsHelper.saveToLocalStorage([STORAGE_KEY, session]);
  }

  static getConfirmationSession(): IConfirmationSession | null {
    const storedData = StorageUtilsHelper.getItemsFromLocalStorage([
      STORAGE_KEY,
    ]);
    const data = storedData[STORAGE_KEY] as IConfirmationSession;
    if (!data) return null;

    try {
      const session: IConfirmationSession = data;
      const now = new Date();
      const expires = new Date(session.confirmationCodeExpires);
      if (isNaN(expires.getTime()) || expires <= now) {
        StorageUtilsHelper.deleteFromLocalStorage([STORAGE_KEY]);
        return null;
      }
      return session;
    } catch {
      StorageUtilsHelper.deleteFromLocalStorage([STORAGE_KEY]);
      return null;
    }
  }

  static clearConfirmationSession() {
    StorageUtilsHelper.deleteFromLocalStorage([STORAGE_KEY]);
  }
}
