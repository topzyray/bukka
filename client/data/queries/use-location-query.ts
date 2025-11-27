import { useCustomQuery } from "@/data/queries/base";
import { LocationApiService } from "../services/LocationApiService";
import { QueryKeyEnum } from "../enums";

export const useLocations = (q?: string | undefined, enabled = true) =>
  useCustomQuery(
    [QueryKeyEnum.LOCATIONS, q],
    () => LocationApiService.searchPlaces({ search: q }),
    {
      enabled: Boolean(enabled && q && q.length >= 2),
      staleTime: 1000 * 60 * 10,
      params: { q },
    }
  );
