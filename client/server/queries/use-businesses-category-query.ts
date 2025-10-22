import { useCustomInfiniteQuery, useCustomQuery } from "@/server/queries/base";
import { BusinessCategoryApiService } from "../services/BusinessCategoryApiService";
import { BusinessCategory } from "../interfaces/BusinessCategory";
import { User } from "../interfaces/User";

export const useBusinessCategories = (enabled = true) =>
  useCustomQuery(
    ["admin:business-categories"],
    () =>
      BusinessCategoryApiService.getCategories({
        pageNumber: 1,
        pageSize: 100,
      }),
    { enabled, staleTime: 1000 * 60 * 10 }
  );

export const useInfiniteBusinessCategories = ({
  user,
  limit,
  type,
  searchQuery = "",
  initialPageParam,
}: {
  user?: User;
  limit?: number;
  type?: string;
  searchQuery?: string;
  initialPageParam?: number;
}) => {
  return useCustomInfiniteQuery<BusinessCategory>(
    ["business-categories", user?.id],
    ({ pageNumber, ...rest }) =>
      BusinessCategoryApiService.getCategories({
        pageNumber: pageNumber,
        pageSize: limit,
        search: searchQuery,
        type: type,
        ...rest,
      }),
    {
      params: { searchParams: searchQuery, type },
      enabled: !!user?.id,
      initialPageParam: initialPageParam ?? 1,
      staleTime: 1000 * 60 * 5,
    }
  );
};
