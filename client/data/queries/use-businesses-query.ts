import {
  useCustomQuery,
  useCustomInfiniteQuery,
  BukkaResponse,
  QueryParams,
  PagedResponse,
} from "@/data/queries/base";
import { BusinessApiService } from "@/data/services/BusinessApiService";
import { Business } from "@/data/interfaces/Business";
import { QueryKeyEnum } from "../enums";
import { MapBounds } from "../interfaces/MapBounds";
import { useMemo } from "react";

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
    [QueryKeyEnum.BUSINESSES_INFINITE, search, filters],
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

export const useInfiniteFeaturedBusinessesQuery = ({
  pageSize = 10,
  enabled = true,
}: {
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomInfiniteQuery<Business>(
    [QueryKeyEnum.FEATURED_BUSINESSES, pageSize],
    ({ pageNumber }) =>
      BusinessApiService.getFeaturedBusinesses({
        pageNumber,
        pageSize,
      }),
    {
      params: { pageSize },
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
    [QueryKeyEnum.BUSINESSES, search, filters, pageNumber, pageSize],
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

export const useBusinessesByBounds = ({
  enabled,
  getBounds,
  filters,
  pageSize,
}: {
  enabled: boolean;
  getBounds: () => MapBounds | null;
  filters?: Record<string, any>;
  pageSize?: number;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Business[]>>, Error>(
    [QueryKeyEnum.BUSINESSES_BOUNDS, JSON.stringify(filters), pageSize],
    async () => {
      const b = getBounds();

      if (!b) {
        return { responseData: { data: [] } } as any;
      }

      return BusinessApiService.getBusinessesByBounds({
        pageSize,
        ...b,
        ...filters,
      });
    },
    {
      enabled,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }
  );
};

// export const useBusinessesByBounds = ({
//   enabled,
//   bounds, // change: pass MapBounds | null not ref
//   filters = {},
//   pageSize = 100,
// }: {
//   enabled: boolean;
//   bounds: MapBounds | null;
//   filters?: Record<string, any>;
//   pageSize?: number;
// }) => {
//   // create a stable key representation of bounds + filters
//   const key = useMemo(() => {
//     const boundsKey = bounds
//       ? `${bounds.north.toFixed(6)}_${bounds.south.toFixed(
//           6
//         )}_${bounds.east.toFixed(6)}_${bounds.west.toFixed(6)}`
//       : "no-bounds";
//     const filtersKey = Object.keys(filters).length
//       ? JSON.stringify(filters)
//       : "no-filters";
//     return [QueryKeyEnum.BUSINESSES_BOUNDS, boundsKey, filtersKey, pageSize];
//   }, [bounds, filters, pageSize]);

//   return useCustomQuery<BukkaResponse<PagedResponse<Business[]>>, Error>(
//     key,
//     () => {
//       // BusinessApiService.getBusinessesByBounds({
//       //   pageSize,
//       //   ...(bounds ?? {}),
//       //   ...filters,
//       // }),
//       const controller = new AbortController();
//       const promise = BusinessApiService.getBusinessesByBounds({
//         pageSize,
//         ...(bounds ?? {}),
//         ...filters,
//         signal: controller.signal,
//       });
//       (promise as any).cancel = () => controller.abort();
//       return promise;
//     },
//     {
//       params: { pageSize, ...(bounds ?? {}), ...filters },
//       enabled: enabled && !!bounds, // only enable if we have bounds
//       staleTime: 30_000,
//       refetchOnWindowFocus: false,
//     }
//   );
// };

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
    [QueryKeyEnum.MY_BUSINESSES, search, filters, pageNumber, pageSize],
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
    [QueryKeyEnum.BUSINESS, businessId],
    () => BusinessApiService.getBusinessById(businessId),
    { enabled: !!businessId, placeholderData: (prev) => prev }
  );
};
