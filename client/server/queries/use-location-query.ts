import { useCustomQuery } from "@/server/queries/base";
import { LocationApiService } from "../services/LocationApiService";

export const useLocations = (q?: string | undefined, enabled = true) =>
  useCustomQuery(
    ["locations", q],
    () => LocationApiService.searchPlaces({ search: q }),
    {
      enabled: Boolean(enabled && q && q.length >= 2),
      staleTime: 1000 * 60 * 10,
      params: { q },
    }
  );
