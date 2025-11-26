import { useCallback, useEffect, useMemo, useState } from "react";
import { CookieCategory, CookieConsentState } from "@/types";
import { CookieConsentHelper } from "@/helpers";

export const DEFAULT_VERSION = "1.0";

export function useCookieConsent(defaultCategories: CookieCategory[] = []) {
  const [consent, setConsent] = useState<CookieConsentState | null>(() => {
    const loaded = CookieConsentHelper.loadConsent();
    if (loaded) return loaded;
    // create default provisional state
    const prefs: Record<string, boolean> = {};
    for (const c of defaultCategories)
      prefs[c.id] = !!c.defaultEnabled || !!c.required;
    return {
      version: DEFAULT_VERSION,
      timestamp: Date.now(),
      preferences: prefs,
      acceptedAll: false,
    };
  });

  useEffect(() => {
    // ensure we always have preferences keys for categories added later
    if (!consent) return;
    const changed = { ...consent };
    for (const c of defaultCategories) {
      if (changed.preferences[c.id] === undefined)
        changed.preferences[c.id] = !!c.defaultEnabled || !!c.required;
    }
    if (JSON.stringify(changed) !== JSON.stringify(consent)) {
      setConsent(changed);
      CookieConsentHelper.saveConsent(changed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultCategories)]);

  const acceptAll = useCallback(() => {
    if (!consent) return;
    const prefs: Record<string, boolean> = {};
    for (const k of Object.keys(consent.preferences)) prefs[k] = true;
    const s: CookieConsentState = {
      ...consent,
      timestamp: Date.now(),
      preferences: prefs,
      acceptedAll: true,
    };
    CookieConsentHelper.saveConsent(s);
    setConsent(s);
  }, [consent]);

  const acceptSelected = useCallback((preferences: Record<string, boolean>) => {
    const s: CookieConsentState = {
      version: DEFAULT_VERSION,
      timestamp: Date.now(),
      preferences,
      acceptedAll: false,
    };
    CookieConsentHelper.saveConsent(s);
    setConsent(s);
  }, []);

  const resetConsent = useCallback(() => {
    const s: CookieConsentState = {
      version: DEFAULT_VERSION,
      timestamp: Date.now(),
      preferences: {},
      acceptedAll: false,
    };
    CookieConsentHelper.saveConsent(s);
    setConsent(s);
  }, []);

  const enabledCategories = useMemo(() => {
    if (!consent) return {};
    return Object.fromEntries(
      Object.entries(consent.preferences).filter(([, v]) => v)
    );
  }, [consent]);

  return {
    consent,
    acceptAll,
    acceptSelected,
    resetConsent,
    setConsent,
    enabledCategories,
  };
}
