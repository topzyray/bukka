import { STORE_KEYS } from "@/configs";
import { CookieConsentState } from "@/types";
import { StorageUtilsHelper } from "@/utils";

export class CookieConsentHelper {
  static loadConsent = (): CookieConsentState | null => {
    try {
      if (typeof window === "undefined") return null;
      const raw = StorageUtilsHelper.getItemFromLocalStorage(
        STORE_KEYS.SITE_COOKIE_CONSENT_V1
      );
      if (!raw) return null;
      return raw as CookieConsentState;
    } catch (e) {
      console.warn("Load Cookie Consent failed", e);
      return null;
    }
  };

  static saveConsent = (state: CookieConsentState) => {
    try {
      if (typeof window === "undefined") return;
      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.SITE_COOKIE_CONSENT_V1,
        state,
      ]);
    } catch (e) {
      console.warn("Save Cookie Consent failed", e);
    }
  };

  static clearConsent = () => {
    try {
      if (typeof window === "undefined") return;
      StorageUtilsHelper.deleteFromLocalStorage(
        STORE_KEYS.SITE_COOKIE_CONSENT_V1
      );
    } catch {
      /* ignore */
    }
  };
}
