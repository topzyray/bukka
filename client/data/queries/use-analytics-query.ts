import { QueryKeyEnum, UserRoleEnum } from "../enums";
import { AdminOverview, UserActivitiesSummary } from "../interfaces/Analytics";
import { UserRole } from "../interfaces/Auth";
import { AnalyticsApiService } from "../services/AnalyticsApiService";
import { BukkaResponse, useCustomQuery } from "./base";

export const useUserActivitySummary = ({ userId }: { userId: number }) => {
  return useCustomQuery<BukkaResponse<UserActivitiesSummary>>(
    [QueryKeyEnum.USER_ACTIVITIES_SUMMARY],
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
    [QueryKeyEnum.ADMIN_OVERVIEW],
    () => AnalyticsApiService.adminOverview(),
    {
      enabled: !!userId && role === UserRoleEnum.ADMIN,
      staleTime: 1000 * 60 * 5,
    }
  );
};
