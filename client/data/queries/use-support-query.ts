import {
  useCustomQuery,
  BukkaResponse,
  QueryParams,
  PagedResponse,
} from "@/data/queries/base";
import { SupportApiService } from "../services";
import { Support } from "../interfaces/Support";

export const useSupportsQuery = ({
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
      enabled,
    }
  );
};

export const useSupportById = ({ supportId }: { supportId: number }) => {
  return useCustomQuery<BukkaResponse<Support>>(
    ["support", supportId],
    () => SupportApiService.getSupportByTicketId(supportId),
    { enabled: !!supportId, placeholderData: (prev) => prev }
  );
};
