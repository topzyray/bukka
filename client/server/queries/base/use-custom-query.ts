import {
  useQuery,
  UseQueryResult,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import { QueryParams } from "./types";

/**
 * A reusable, strongly-typed wrapper for React Query's useQuery.
 * Automatically builds dynamic keys based on provided params.
 */
export const useCustomQuery = <TData, TError = Error>(
  queryKey: QueryKey,
  queryFn: (params: QueryParams) => Promise<TData>,
  {
    params = {},
    enabled = true,
    staleTime = 1000 * 60 * 5,
    refetchOnMount = false,
    ...options
  }: {
    params?: QueryParams;
    enabled?: boolean;
    staleTime?: number;
    refetchOnMount?: boolean | "always";
  } & Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    "queryKey" | "queryFn"
  > = {}
): UseQueryResult<TData, TError> => {
  const base = Array.isArray(queryKey) ? queryKey : [queryKey];
  const dynamicQueryKey: QueryKey = [
    ...base,
    params?.id ?? null,
    params?.pageNumber ?? null,
    params?.pageSize ?? null,
    params?.search ?? null,
    Object.keys(params || {}).length > 0 ? params : null,
  ].filter((k) => k !== null && k !== undefined);

  const query = useQuery<TData, TError>({
    queryKey: dynamicQueryKey,
    queryFn: async () => queryFn(params),
    enabled,
    staleTime,
    refetchOnMount,
    ...options,
  });

  return query;
};
