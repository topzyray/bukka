import { useCustomQuery } from "@/server/queries/use-query.hook";
import { UserApiService } from "@/server/services/UserApiService";

export const useOnboardingProgress = (userId: number) => {
  return useCustomQuery(
    ["onboarding-progress", userId],
    () => UserApiService.getOnboardingProgress(userId),
    { id: userId },
    !!userId
  );
};
