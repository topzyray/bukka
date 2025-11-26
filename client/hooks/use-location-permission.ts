import { STORE_KEYS } from "@/configs";
import { StorageUtilsHelper } from "@/utils";
import { useCallback, useState } from "react";
import { LOCATION_DENIAL_COOLDOWN } from "@/constants/durations";

export type GeoPosition = {
  latitude: number;
  longitude: number;
  raw?: GeolocationPosition;
};

export function useLocationPermission() {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (options?: PositionOptions) => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator?.geolocation) {
        setError("Geolocation is not available on your device.");
        setLoading(false);
        return null;
      }

      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      );

      const geo: GeoPosition = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        raw: pos,
      };

      setPosition(geo);
      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.LOCATION_GRANTED,
        "true",
      ]);
      StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.LOCATION_DENIED_AT);

      setLoading(false);
      return geo;
    } catch (err: any) {
      setError(err?.message ?? "Permission denied.");

      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.LOCATION_DENIED_AT,
        Date.now().toString(),
      ]);
      //   localStorage.setItem(
      //     STORE_KEYS.LOCATION_DENIED_AT,
      //     Date.now().toString()
      //   );
      StorageUtilsHelper.deleteFromLocalStorage(STORE_KEYS.LOCATION_GRANTED);

      setLoading(false);
      return null;
    }
  }, []);

  const hasCooldownExpired = () => {
    const deniedAt = StorageUtilsHelper.getItemFromLocalStorage(
      STORE_KEYS.LOCATION_DENIED_AT
    );
    if (!deniedAt) return true;

    const diff = Date.now() - Number(deniedAt);
    return diff > LOCATION_DENIAL_COOLDOWN;
  };

  return {
    loading,
    position,
    error,
    request,
    hasCooldownExpired,
  };
}
