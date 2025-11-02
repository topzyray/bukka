import {
  useCustomQuery,
  useCustomInfiniteQuery,
  BukkaResponse,
  QueryParams,
  PagedResponse,
} from "@/data/queries/base";
import { BusinessApiService } from "@/data/services/BusinessApiService";
import { Business } from "@/data/interfaces/Business";

export const useInfiniteBusinessesQuery = ({
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
    ["businesses-infinite", search, filters],
    ({ pageNumber, ...filters }) =>
      BusinessApiService.getBusinesses({
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

export const useBusinessesQuery = ({
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
  return useCustomQuery<BukkaResponse<PagedResponse<Business[]>>, Error>(
    ["businesses", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      BusinessApiService.getBusinesses({
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

export const useMyBusinessesQuery = ({
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
  return useCustomQuery<BukkaResponse<PagedResponse<Business[]>>, Error>(
    ["my-businesses", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      BusinessApiService.getLoggedInVendorBusinesses({
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

export const useBusinessById = ({ businessId }: { businessId: number }) => {
  return useCustomQuery<BukkaResponse<Business>>(
    ["business", businessId],
    () => BusinessApiService.getBusinessById(businessId),
    { enabled: !!businessId, placeholderData: (prev) => prev }
  );
};
