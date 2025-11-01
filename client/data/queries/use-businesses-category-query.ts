import {
  BukkaResponse,
  PagedResponse,
  QueryParams,
  useCustomInfiniteQuery,
  useCustomQuery,
} from "@/data/queries/base";
import { BusinessCategoryApiService } from "../services/BusinessCategoryApiService";
import { BusinessCategory } from "../interfaces/BusinessCategory";

export const useInfiniteCategoriesQuery = ({
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
  return useCustomInfiniteQuery<BusinessCategory>(
    ["business-categories-infinite", search, filters],
    ({ pageNumber, ...filters }) =>
      BusinessCategoryApiService.getCategories({
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

export const useCategoriesQuery = ({
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
  return useCustomQuery<
    BukkaResponse<PagedResponse<BusinessCategory[]>>,
    Error
  >(
    ["business-categories", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      BusinessCategoryApiService.getCategories({
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
