import {
  useCustomQuery,
  BukkaResponse,
  PagedResponse,
} from "@/data/queries/base";
import { QueryKeyEnum } from "@/data/enums";
import { ClaimApiService } from "@/data/services";
import { BusinessClaim } from "../interfaces/BusinessClaim";

export const useBusinessClaimsQuery = ({
  pageNumber = 1,
  search = "",
  filters = {},
  pageSize = 10,
  enabled = true,
}) => {
  return useCustomQuery<BukkaResponse<PagedResponse<BusinessClaim[]>>, Error>(
    [QueryKeyEnum.BUSINESS_CLAIMS, search, filters, pageNumber, pageSize],
    (params) =>
      ClaimApiService.getClaims({
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
