import { QueryKeyEnum } from "../enums";
import { Review } from "../interfaces/Review";
import { ReviewApiService } from "../services";
import {
  BukkaResponse,
  PagedResponse,
  QueryParams,
  useCustomInfiniteQuery,
  useCustomQuery,
} from "./base";

export const useInfiniteReviewsQuery = ({
  businessId,
  filters,
  pageSize,
  enabled,
}: {
  businessId: number;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomInfiniteQuery<Review>(
    [QueryKeyEnum.BUSINESS_REVIEWS, businessId, JSON.stringify(filters)],
    ({ pageNumber }) =>
      ReviewApiService.getReviews({
        pageNumber,
        pageSize,
        businessId,
        ...filters,
      }),
    {
      params: { pageSize, businessId, ...filters },
      initialPageParam: 1,
      enabled: !!enabled && !!businessId,
    }
  );
};

export const useUserAllReviewsQuery = ({
  userId,
  pageNumber = 1,
  filters = {},
  pageSize = 10,
  enabled = true,
}: {
  userId: number;
  pageNumber?: number;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Review[]>>, Error>(
    [QueryKeyEnum.USER_REVIEWS, userId, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      ReviewApiService.getReviews({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        userId,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, userId, ...filters },
      enabled: !!userId && enabled,
    }
  );
};
