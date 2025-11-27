import { useCustomQuery } from "./base";
import { LocationApiService } from "../services/LocationApiService";
import { QueryKeyEnum } from "../enums";

export const useAutoComplete = (query: string) => {
  return useCustomQuery(
    [QueryKeyEnum.LOCATION_AUTOCOMPLETE, query],
    () => LocationApiService.fetchLocationSuggestions(query),
    {
      enabled: query.trim().length >= 2, // only run for valid queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
      retry: 2,
    }
  );
};
