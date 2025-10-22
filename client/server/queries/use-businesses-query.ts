import { useCustomQuery, useCustomInfiniteQuery } from "@/server/queries/base";
import { BusinessApiService } from "@/server/services/BusinessApiService";
import { Business } from "@/server/interfaces/Business";

export const useBusinesses = ({
  search = "",
  pageSize = 10,
  enabled = true,
} = {}) => {
  return useCustomInfiniteQuery<Business>(
    ["businesses", search],
    ({ pageNumber, ...rest }) =>
      BusinessApiService.getBusinesses({
        pageNumber,
        pageSize,
        search,
        ...rest,
      }),
    {
      params: { searchParams: search, limit: pageSize },
      initialPageParam: 1,
      enabled,
    }
  );
};

export const useBusinessById = (businessId?: number) => {
  return useCustomQuery(
    ["business", businessId],
    () => BusinessApiService.getBusinessById(businessId!),
    { enabled: !!businessId }
  );
};
