"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TagInputComponent } from "@/components/form-ui/base/tag-input-component";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { SelectComponent } from "@/components/form-ui/base/select-component";
import { useAuth } from "@/providers";
import { useQueryClient } from "@tanstack/react-query";
import { useOnboardingProgress } from "@/data/queries/use-onboarding-progress-query";
import { useCreateUserPersonalization } from "@/data/mutations/userPersonalizaton/use-create-user-personalization";
import { toast } from "sonner";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { useUpdateUserData } from "@/data/mutations/user/use-update-user-data";
import { cuisineSuggestions } from "@/constants/menu-info";

export const userPersonalizedSchema = z.object({
  preferredCuisines: z
    .array(z.string())
    .min(1, "Please select at least one cuisine"),
  dietaryRestrictions: z
    .array(
      z.enum(["None", "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher"])
    )
    .optional(),
  mealPreferences: z
    .array(
      z.enum(["Breakfast", "Lunch", "Dinner", "Snacks", "Prefer not to say"])
    )
    .optional(),
  preferredDeliveryTime: z.enum([
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
    "Anytime of the day",
  ]),
  paymentPreference: z.enum(["Card", "Mobile Money", "Cash on Delivery"]),
  allergies: z.string().max(200).optional(),
});

type UserPersonalizationFormData = z.infer<typeof userPersonalizedSchema>;

const dietaryOptions = [
  { label: "None", value: "None" },
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Gluten Free", value: "Gluten Free" },
  { label: "Halal", value: "Halal" },
  { label: "Kosher", value: "Kosher" },
];

const mealOptions = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snacks", value: "Snacks" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

const deliveryTimes = [
  { label: "Morning", value: "Morning" },
  { label: "Afternoon", value: "Afternoon" },
  { label: "Evening", value: "Evening" },
  { label: "Night", value: "Night" },
  { label: "Anytime of the Day", value: "Anytime of the day" },
];

const paymentMethods = [
  { label: "Card", value: "Card" },
  { label: "Mobile Money", value: "Mobile Money" },
  { label: "Cash on Delivery", value: "Cash on Delivery" },
];

export function UserPersonalizedDetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
  stepIndex?: number;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(userPersonalizedSchema),
    defaultValues: {},
    mode: "all",
  });

  const { data: savedProgress, isLoading: isFetchingProgress } =
    useOnboardingProgress(user?.id as number);

  const { mutateAsync: updateUserData, isPending: isUpdatingUserData } =
    useUpdateUserData({
      onSuccess: () => {
        form.reset;
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        onNext();
      },
      toastStatusMessage: false,
    });

  const {
    mutateAsync: createUserPersonalization,
    isPending: isCreatingUserPersonalization,
  } = useCreateUserPersonalization({
    userId: user?.id,
    onSuccess: () => {
      updateUserData({ onboardingProgress: savedProgress + 1 });
    },
  });

  const onSubmit = (data: UserPersonalizationFormData) => {
    if (!user?.id) {
      toast.error("User not found.", {
        description: "Please sign in again.",
      });
      return;
    }
    createUserPersonalization({
      dietaryRestrictions: data.dietaryRestrictions as string[],
      mealPreferences: data.mealPreferences as string[],
      paymentPreference: data.paymentPreference,
      preferredCuisines: data.preferredCuisines,
      preferredDeliveryTime: data.preferredDeliveryTime,
      allergies: data?.allergies,
    });
  };

  return (
    <>
      {isFetchingProgress ? (
        <CircularLoader text="Loading User Personalization Form" />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TagInputComponent
              formControl={form.control}
              formName="preferredCuisines"
              formLabel="Preferred Cuisines"
              formPlaceholder="Type or select cuisines..."
              enableSuggestions
              suggestions={cuisineSuggestions}
              disabled={isCreatingUserPersonalization || isUpdatingUserData}
            />

            <SelectComponent
              formControl={form.control}
              formName="dietaryRestrictions"
              formLabel="Dietary Restrictions"
              formPlaceholder="Select dietary restrictions"
              formOptionLabel="Dietary Options"
              formOptionData={dietaryOptions}
              multiSelect={true} // Multi-select enabled
              disabled={isCreatingUserPersonalization || isUpdatingUserData}
            />

            <SelectComponent
              formControl={form.control}
              formName="mealPreferences"
              formLabel="Meal Preferences"
              formPlaceholder="Select meal preferences"
              formOptionLabel="Meal Types"
              formOptionData={mealOptions}
              multiSelect={true} // Multi-select enabled
              disabled={isCreatingUserPersonalization || isUpdatingUserData}
            />

            <SelectComponent
              formControl={form.control}
              formName="preferredDeliveryTime"
              formLabel="Preferred Delivery Time"
              formPlaceholder="Select delivery time"
              formOptionLabel="Delivery Time"
              formOptionData={deliveryTimes}
              disabled={isCreatingUserPersonalization || isUpdatingUserData}
            />

            <SelectComponent
              formControl={form.control}
              formName="paymentPreference"
              formLabel="Preferred Payment Method"
              formPlaceholder="Select payment method"
              formOptionLabel="Payment Method"
              formOptionData={paymentMethods}
              disabled={isCreatingUserPersonalization || isUpdatingUserData}
            />

            <InputComponent
              formControl={form.control}
              formName="allergies"
              formLabel="Allergies or Sensitivities"
              formInputType="text"
              formPlaceholder="List any allergies..."
              disabled={isCreatingUserPersonalization || isUpdatingUserData}
            />

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onBack}
                disabled={isCreatingUserPersonalization || isUpdatingUserData}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  isCreatingUserPersonalization ||
                  isUpdatingUserData
                }
              >
                {isCreatingUserPersonalization || isUpdatingUserData
                  ? "Saving..."
                  : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
