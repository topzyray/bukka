import { useCustomInfiniteQuery } from "@/data/queries/base";
import { BusinessApiService } from "@/data/services/BusinessApiService";
import { Business } from "@/data/interfaces/Business";

export const useVendorBusinesses = ({
  search = "",
  filters = {},
  pageSize = 10,
  enabled = true,
}: {
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomInfiniteQuery<Business>(
    ["vendor-businesses", search, filters],
    ({ pageNumber, ...filters }) =>
      BusinessApiService.getLoggedInVendorBusinesses({
        pageNumber,
        pageSize,
        search,
        ...filters,
      }),
    {
      params: { search, pageSize, ...filters },
      initialPageParam: 1,
      enabled,
    }
  );
};

// export const useBusinessById = ({ businessId }: { businessId: number }) => {
//   return useCustomQuery(
//     ["business", businessId],
//     () => BusinessApiService.getBusinessById(businessId),
//     { enabled: !!businessId }
//   );
// };
