"use client";

import React from "react";
import { CreateEditBusinessForm } from "@/components/forms/business/component/create-edit-business-form";
import { useOnboardingProgress } from "@/server/queries/use-onboarding-progress-query";
import { useUpdateUserData } from "@/server/mutations/user/use-update-user-data";
import { useAuth } from "@/providers";
import { useQueryClient } from "@tanstack/react-query";
import { CircularLoader } from "@/components/loaders/circular-loader";

export default function BusinessDetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
  stepIndex?: number;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: savedProgress, isLoading: isFetchingProgress } =
    useOnboardingProgress(user?.id as number);

  const { mutateAsync: updateUserData, isPending: isUpdatingUserData } =
    useUpdateUserData({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        onNext();
      },
      toastStatusMessage: false,
    });

  return (
    <>
      {isFetchingProgress ? (
        <CircularLoader />
      ) : (
        <CreateEditBusinessForm
          isEdit={false}
          initial={undefined}
          onSuccess={() => {
            updateUserData({ onboardingProgress: savedProgress + 1 });
          }}
          containerClassName="px-1"
          onBack={onBack}
          busy={isUpdatingUserData}
        />
      )}
    </>
  );
}
