import {
  useCustomQuery,
  BukkaResponse,
  QueryParams,
} from "@/data/queries/base";
import { QueryKeyEnum } from "../enums";
import { PlaceAdminApiService } from "../services/PlaceAdminApiService";
import { PlaceSearchResult } from "../interfaces/PlaceSearchResult";

export const usePlaceSearchQuery = ({
  filters = {},
  enabled = true,
}: {
  filters?: Record<string, any>;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PlaceSearchResult[]>, Error>(
    [QueryKeyEnum.PLACE_SEARCH, filters],
    (params?: QueryParams) =>
      PlaceAdminApiService.searchPlace({
        ...filters,
        ...params,
      }),
    {
      params: { ...filters },
      enabled,
    }
  );
};
