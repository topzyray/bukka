"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema } from "@/server/schemas/onboarding";
import { useOnboarding } from "@/providers/onboarding-provider";
import { Button } from "@/components/ui/button";
import InputComponent from "@/components/forms/base/input-component";
import SelectComponent from "@/components/forms/base/select-component";
import { PhoneNumberInput } from "@/components/forms/base/phone-number-component";
import TextAreaComponent from "@/components/forms/base/text-area-component";
import { GenderEnum } from "@/server/enums";
import { useAuth } from "@/providers/auth-provider";
import { OnboardingProgressDto } from "@/server/dtos/UserDto";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useUpdateUserData } from "@/server/mutations/user/use-update-user-data";

export default function PersonalDetailsStep({
  onNext,
  onBack,
  stepIndex = 1, // assuming 0 = image upload
}: {
  onNext: () => void;
  onBack?: () => void;
  stepIndex?: number;
}) {
  const { user } = useAuth();
  const { state, actions } = useOnboarding();

  const form = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: state.personalDetails ?? undefined,
    mode: "all",
  });

  const { mutateAsync: updateUserData, isPending: isUpdatingUserData } =
    useUpdateUserData({
      resetForm: form.reset,
    });

  const handleSubmit = async (data: any) => {
    if (!user?.id) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    try {
      // 1️⃣ Save user details to backend
      await updateUserData({
        userId: user.id,
        ...data,
      });

      // 2️⃣ Save onboarding progress to backend
      const progressPayload: OnboardingProgressDto = {
        stepIndex,
      };

      // await saveOnboardingProgressMutation.mutateAsync(progressPayload);

      // 3️⃣ Persist locally
      actions.setPersonalDetails(data);

      // 4️⃣ Proceed to next step
      onNext();
    } catch (error: any) {
      toast.error("Failed to save personal details");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 animate-in fade-in duration-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputComponent
            formControl={form.control}
            formName="firstName"
            formInputType="text"
            formPlaceholder="First name"
          />
          <InputComponent
            formControl={form.control}
            formName="lastName"
            formInputType="text"
            formPlaceholder="Last name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputComponent
            formControl={form.control}
            formName="username"
            formInputType="text"
            formPlaceholder="Username"
          />
          <SelectComponent
            formControl={form.control}
            formName="gender"
            formPlaceholder="Gender"
            formOptionLabel="I am a"
            formOptionData={[
              { value: GenderEnum.MALE, label: "Male" },
              { value: GenderEnum.FEMALE, label: "Female" },
              { value: GenderEnum.NON_BINARY, label: "Non-Binary" },
              { value: GenderEnum.OTHERS, label: "Other" },
            ]}
          />
        </div>

        <PhoneNumberInput
          formControl={form}
          formName="phoneNumber"
          autoDetect
        />

        <TextAreaComponent
          formControl={form.control}
          formName="bio"
          formPlaceholder="Bio"
          formDescription="Max 150 characters"
          maxLength={150}
        />

        <div className="flex gap-2 justify-end pt-4 border-t border-border/30">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              // disabled={
              //   updateUserMutation.isPending ||
              //   saveOnboardingProgressMutation.isPending
              // }
            >
              Back
            </Button>
          )}
          <Button type="submit" disabled={isUpdatingUserData}>
            {isUpdatingUserData ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
