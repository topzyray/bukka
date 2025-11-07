import { UserRoleEnum } from "../enums";
import { AdminOverview, UserActivitiesSummary } from "../interfaces/Analytics";
import { UserRole } from "../interfaces/Auth";
import { AnalyticsApiService } from "../services/AnalyticsApiService";
import { BukkaResponse, useCustomQuery } from "./base";

export const useUserActivitySummary = ({ userId }: { userId: number }) => {
  return useCustomQuery<BukkaResponse<UserActivitiesSummary>>(
    ["user-activities-summary"],
    () => AnalyticsApiService.userActivitySummary(),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );
};

export const useAdminOverview = ({
  userId,
  role,
}: {
  userId: number;
  role: UserRole;
}) => {
  return useCustomQuery<BukkaResponse<AdminOverview>>(
    ["admin-overview"],
    () => AnalyticsApiService.adminOverview(),
    {
      enabled: !!userId && role === UserRoleEnum.ADMIN,
      staleTime: 1000 * 60 * 5,
    }
  );
};
