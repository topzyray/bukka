import { useCustomQuery } from "@/data/queries/base";
import { UserApiService } from "@/data/services/UserApiService";
import { QueryKeyEnum } from "../enums";

export const useOnboardingProgress = (userId: number) => {
  return useCustomQuery(
    [QueryKeyEnum.ONBOARDING_PROGRESS, userId],
    () => UserApiService.getOnboardingProgress(),
    { enabled: !!userId }
  );
};
