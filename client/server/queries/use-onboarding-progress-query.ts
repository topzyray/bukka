import { useCustomQuery } from "@/server/queries/base";
import { UserApiService } from "@/server/services/UserApiService";

export const useOnboardingProgress = (userId: number) => {
  return useCustomQuery(
    ["onboarding-progress", userId],
    () => UserApiService.getOnboardingProgress(),
    { enabled: !!userId }
  );
};
