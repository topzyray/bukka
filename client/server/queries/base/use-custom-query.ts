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
  const dynamicQueryKey = [
    ...((Array.isArray(queryKey) ? queryKey : [queryKey]) as (
      | string
      | number
    )[]),
    params?.id ?? null,
    params?.page ?? null,
    params?.limit ?? null,
    params?.searchParams ?? null,
  ].filter((key) => key !== null && key !== undefined);

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
