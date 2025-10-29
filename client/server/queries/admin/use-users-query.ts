import { useCustomQuery } from "@/server/queries/base";
import { UserManagementApiService } from "@/server/services/UserManagementApiService";

export const useUsers = ({
  enabled,
  filter,
}: {
  enabled: boolean;
  filter: Record<string, any>;
}) =>
  useCustomQuery(
    ["admin:all-users"],
    () =>
      UserManagementApiService.adminGetAllUsers({
        pageNumber: 1,
        pageSize: 100,
        ...filter,
      }),
    { enabled, staleTime: 1000 * 60 * 5 }
  );
