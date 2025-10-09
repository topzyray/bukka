import { useCustomMutation } from "@/server/queries/use-mutation.hook";
import { UserApiService } from "@/server/services/UserApiService";
import { OnboardingProgressDto } from "@/server/dtos/UserDto";

export const useSaveOnboardingProgress = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (err: any) => void
) => {
  return useCustomMutation<UserApiService, OnboardingProgressDto>(
    UserApiService.saveOnboardingProgress,
    {
      onSuccessMessage: "Onboarding progress saved",
      onErrorMessage: "Failed to save progress",
      onSuccessCallback,
      onErrorCallback,
    }
  );
};
