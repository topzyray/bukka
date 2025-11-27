"use client";

import React from "react";
import { CreateEditBusinessForm } from "@/features/dashboard/admin/forms/create-edit-business-form";
import { useOnboardingProgress } from "@/data/queries/use-onboarding-progress-query";
import { useUpdateUserData } from "@/data/mutations/user/use-update-user-data";
import { useAuth } from "@/providers";
import { useQueryClient } from "@tanstack/react-query";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { QueryKeyEnum } from "@/data/enums";

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
        <CircularLoader />
      ) : (
        <CreateEditBusinessForm
          isEdit={false}
          initialData={undefined}
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
