import { useCustomQuery } from "@/server/queries/base";
import { UserApiService } from "../../services";

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
      UserApiService.adminGetUsers({
        pageNumber: 1,
        pageSize: 100,
        ...filter,
      }),
    { enabled, staleTime: 1000 * 60 * 5 }
  );
