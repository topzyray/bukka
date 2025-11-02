import { User } from "@/data/interfaces/User";
import {
  BukkaResponse,
  PagedResponse,
  QueryParams,
  useCustomInfiniteQuery,
  useCustomQuery,
} from "@/data/queries/base";
import { UserManagementApiService } from "@/data/services/UserManagementApiService";

export const useInfiniteUsers = ({
  search = "",
  filters = {},
  pageSize = 100,
  enabled = true,
}: {
  search?: string;
  filters?: Record<string, any>;
  pageSize?: number;
  enabled?: boolean;
}) => {
  return useCustomInfiniteQuery<User>(
    ["admin:all-users-infinite", search, filters],
    ({ pageNumber, ...filters }) =>
      UserManagementApiService.adminGetAllUsers({
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

export const useAdminGetUsersQuery = ({
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
  return useCustomQuery<BukkaResponse<PagedResponse<User[]>>, Error>(
    ["admin:all-users", search, filters, pageNumber, pageSize],
    (params?: QueryParams) =>
      UserManagementApiService.adminGetAllUsers({
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
