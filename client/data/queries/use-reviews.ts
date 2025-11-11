import { Review } from "../interfaces/Review";
import { ReviewApiService } from "../services";
import {
  BukkaResponse,
  PagedResponse,
  QueryParams,
  useCustomInfiniteQuery,
  useCustomQuery,
} from "./base";

// export const useReviews = ({ businessId }: { businessId: number }) => {
//   return useCustomQuery<BukkaResponse<PagedResponse<Review[]>>>(
//     ["business-reviews", businessId],
//     () => ReviewApiService.getReviews(businessId),
//     { enabled: !!businessId }
//   );
// };

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
    ["business-reviews", businessId, JSON.stringify(filters)], // serialize filters
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

export const useUserReviews = ({
  pageNumber = 1,
  search = "",
  filters = {},
  pageSize = 10,
  enabled,
}: {
  pageNumber?: number;
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled: boolean;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Review[]>>, Error>(
    ["user-reviews", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      ReviewApiService.getReviews({
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
