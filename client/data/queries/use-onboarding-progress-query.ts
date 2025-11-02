import { useCustomQuery } from "@/data/queries/base";
import { UserApiService } from "@/data/services/UserApiService";

export const useOnboardingProgress = (userId: number) => {
  return useCustomQuery(
    ["onboarding-progress", userId],
    () => UserApiService.getOnboardingProgress(),
    { enabled: !!userId }
  );
};
