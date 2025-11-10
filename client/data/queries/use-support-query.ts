import {
  useCustomQuery,
  BukkaResponse,
  QueryParams,
  PagedResponse,
} from "@/data/queries/base";
import { SupportApiService } from "../services";
import { Support } from "../interfaces/Support";
import { User } from "../interfaces/User";

export const useSupportsQuery = ({
  user,
  pageNumber = 1,
  search = "",
  filters = {},
  pageSize = 10,
}: {
  user: User | null;
  pageNumber?: number;
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Support[]>>, Error>(
    ["supports", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      SupportApiService.getSupports({
        pageNumber: params?.pageNumber ?? pageNumber,
        pageSize: params?.pageSize ?? pageSize,
        search: params?.search ?? search,
        ...filters,
        ...params,
      }),
    {
      params: { pageNumber, pageSize, search, ...filters },
      enabled: !!user,
    }
  );
};

export const useSupportById = ({
  ticketId,
  user,
}: {
  ticketId: string;
  user: User;
}) => {
  return useCustomQuery<BukkaResponse<Support>>(
    ["support", ticketId],
    () => SupportApiService.getSupportByTicketId(ticketId),
    { enabled: !!ticketId && !!user, placeholderData: (prev) => prev }
  );
};
