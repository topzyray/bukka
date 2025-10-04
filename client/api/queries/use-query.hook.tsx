import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface QueryParams {
  page?: number;
  limit?: number;
  filter?: string;
  searchParams?: string;
  academic_session?: string;
  term?: string;
  id?: string | number | string[] | number[];
}

export const useCustomQuery = <T,>(
  queryKey: (string | number)[],
  queryFn: (params: QueryParams) => Promise<T>,
  params?: QueryParams,
  enabled?: boolean,
  staleTime?: number,
  refetchOnMount?: boolean,
): UseQueryResult<T, Error> => {
  const dynamicQueryKey = [
    ...queryKey,
    params?.id ?? null,
    params?.page ?? null,
    params?.limit ?? null,
    params?.searchParams ?? null,
    params?.academic_session ?? null,
    params?.term ?? null,
  ].filter((key) => key !== null);

  const query = useQuery({
    queryKey: dynamicQueryKey,
    queryFn: () => queryFn(params || {}),
    enabled: enabled !== undefined ? enabled : true,
    staleTime,
    refetchOnMount,
  });

  return query;
};
