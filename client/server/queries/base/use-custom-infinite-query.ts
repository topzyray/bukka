import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { BukkaResponse, QueryParams } from "./types";

interface NormalizedPagedData<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

interface UseCustomInfiniteQueryOptions<TData, TError>
  extends Omit<
    UseInfiniteQueryOptions<
      NormalizedPagedData<TData>, // QueryFnData: normalized page data
      TError,
      InfiniteData<NormalizedPagedData<TData>, number>,
      QueryKey,
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > {
  params?: QueryParams;
  initialPageParam?: number;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * A reusable, strongly-typed wrapper for React Query's useInfiniteQuery.
 * Designed for APIs that return a BukkaResponse structure (pageNumber, totalPages).
 */
export const useCustomInfiniteQuery = <TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: (
    params: QueryParams & { pageNumber: number }
  ) => Promise<BukkaResponse<TData[]>>,
  {
    params = {},
    initialPageParam = 1,
    enabled = true,
    staleTime = 1000 * 60 * 5,
    ...options
  }: UseCustomInfiniteQueryOptions<TData, TError> = {}
): UseInfiniteQueryResult<
  InfiniteData<NormalizedPagedData<TData>, number>,
  TError
> => {
  const dynamicQueryKey = [
    ...((Array.isArray(queryKey) ? queryKey : [queryKey]) as (
      | string
      | number
    )[]),
    Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== null && value !== undefined
      )
    ),
  ];

  const infiniteQuery = useInfiniteQuery<
    NormalizedPagedData<TData>,
    TError,
    InfiniteData<NormalizedPagedData<TData>, number>,
    QueryKey,
    number
  >({
    queryKey: dynamicQueryKey,
    initialPageParam,
    queryFn: async ({ pageParam }) => {
      const backendResponse = await queryFn({
        ...params,
        pageNumber: pageParam,
      });

      const rd = backendResponse.responseData;

      // ✅ Normalize backend fields to a unified shape
      return {
        data: rd.data ?? [],
        pageNumber: rd.page,
        pageSize: rd.pageSize,
        totalRecords: rd.total,
        totalPages: rd.pageCount,
      };
    },
    getNextPageParam: (lastPage) => {
      const next =
        lastPage.pageNumber < lastPage.totalPages
          ? lastPage.pageNumber + 1
          : undefined;
      return next;
    },
    enabled,
    staleTime,
    ...options,
  });

  return infiniteQuery;
};
