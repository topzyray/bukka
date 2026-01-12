"use client";

import React from "react";
import { useAuth } from "@/providers";
import { queryClient } from "@/lib";
import { useOnboardingProgress } from "@/data/queries/use-onboarding-progress-query";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useUpdateUserData } from "@/data/mutations/user/use-update-user-data";
import { CreateEditPersonalizationForm } from "@/features/dashboard/user/forms/create-edit-personalization";
import { extractErrorMessage } from "@/utils";
import { QueryKeyEnum } from "@/data/enums";

export function UserPersonalizedDetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
  stepIndex?: number;
}) {
  const { user } = useAuth();

  const {
    data: savedProgress,
    isLoading: isFetchingProgress,
    isError,
    error,
  } = useOnboardingProgress(user?.id as number);

  const { mutateAsync: updateUserData, isPending: isUpdatingUserData } =
    useUpdateUserData({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnum.CURRENT_USER],
        });
        onNext();
      },
      toastStatusMessage: false,
    });

  return (
    <>
      {isFetchingProgress ? (
        <CircularLoader text="Loading User Personalization Form" />
      ) : savedProgress ? (
        <CreateEditPersonalizationForm
          isEdit={false}
          initialData={undefined}
          onSuccess={() => {
            updateUserData({ onboardingProgress: savedProgress + 1 });
          }}
          onBack={onBack}
          busy={isUpdatingUserData}
        />
      ) : isError ? (
        extractErrorMessage(error)
      ) : (
        "No data found. Please refresh your page or sign in again."
      )}
    </>
  );
}
