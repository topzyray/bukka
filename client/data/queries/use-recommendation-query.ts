import {
  useCustomQuery,
  BukkaResponse,
  QueryParams,
  PagedResponse,
} from "@/data/queries/base";
import { Recommendation } from "@/data/interfaces/Recommendation";
import { QueryKeyEnum } from "../enums";
import { RecommendationApiService } from "../services";

export const useRecommendationsQuery = ({
  pageNumber = 1,
  search = "",
  filters = {},
  pageSize = 10,
  enabled = true,
}: {
  pageNumber?: number;
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Recommendation[]>>, Error>(
    [QueryKeyEnum.RECOMMENDATIONS, search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      RecommendationApiService.getRecommendations({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        search: params?.search ?? search,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, search, ...filters },
      enabled,
    }
  );
};

export const useMyRecommendationsQuery = ({
  userId,
  pageNumber = 1,
  search = "",
  filters = {},
  pageSize = 10,
  enabled = true,
}: {
  userId: number;
  pageNumber?: number;
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Recommendation[]>>, Error>(
    [QueryKeyEnum.MY_RECOMMENDATIONS, search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      RecommendationApiService.getLoggedInUserRecommendations({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        search: params?.search ?? search,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, search, ...filters },
      enabled: !!userId && enabled,
    }
  );
};

export const useRecommendationById = ({
  recommendationId,
}: {
  recommendationId: number;
}) => {
  return useCustomQuery<BukkaResponse<Recommendation>>(
    [QueryKeyEnum.RECOMMENDATION, recommendationId],
    () => RecommendationApiService.getRecommendationById(recommendationId),
    { enabled: !!recommendationId, placeholderData: (prev) => prev }
  );
};
