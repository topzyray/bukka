"use client";

import React, { useEffect } from "react";
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
import { useUserPersonalization } from "@/data/queries/use-personalization";
import { DietaryRestrictionEnum } from "@/data/enums/DietRestrictionEnum";
import { DeliveryTimeEnum } from "@/data/enums/DeliveryTimeEnum";
import { PaymentMethodEnum } from "@/data/enums/PaymentMethodEnum";
import { MealPreferenceEnum } from "@/data/enums/MealPreferenceEnum";

export const userPersonalizedSchema = z.object({
  preferredCuisines: z
    .array(z.string())
    .min(1, "Please select at least one cuisine"),
  dietaryRestrictions: z
    .array(
      z.enum([
        DietaryRestrictionEnum.NONE,
        DietaryRestrictionEnum.VEGETARIAN,
        DietaryRestrictionEnum.VEGAN,
        DietaryRestrictionEnum.GLUTEN_FREE,
        DietaryRestrictionEnum.HALAL,
        DietaryRestrictionEnum.KOSHER,
      ])
    )
    .optional(),
  mealPreferences: z
    .array(
      z.enum([
        MealPreferenceEnum.BREAKFAST,
        MealPreferenceEnum.LUNCH,
        MealPreferenceEnum.DINNER,
        MealPreferenceEnum.SNACKS,
        MealPreferenceEnum.PREFER_NOT_TO_SAY,
      ])
    )
    .optional(),
  preferredDeliveryTime: z.enum([
    DeliveryTimeEnum.MORNING,
    DeliveryTimeEnum.AFTERNOON,
    DeliveryTimeEnum.EVENING,
    DeliveryTimeEnum.NIGHT,
    DeliveryTimeEnum.ANYTIME,
  ]),
  paymentPreference: z.enum([
    PaymentMethodEnum.CARD,
    PaymentMethodEnum.MOBILE_MONEY,
    PaymentMethodEnum.CASH_ON_DELIVERY,
  ]),
  allergies: z.string().or(z.literal("")).optional().nullable(),
});

type UserPersonalizationFormData = z.infer<typeof userPersonalizedSchema>;

const dietaryOptions = [
  { label: DietaryRestrictionEnum.NONE, value: DietaryRestrictionEnum.NONE },
  {
    label: DietaryRestrictionEnum.VEGETARIAN,
    value: DietaryRestrictionEnum.VEGETARIAN,
  },
  { label: DietaryRestrictionEnum.VEGAN, value: DietaryRestrictionEnum.VEGAN },
  {
    label: DietaryRestrictionEnum.GLUTEN_FREE,
    value: DietaryRestrictionEnum.GLUTEN_FREE,
  },
  { label: DietaryRestrictionEnum.HALAL, value: DietaryRestrictionEnum.HALAL },
  {
    label: DietaryRestrictionEnum.KOSHER,
    value: DietaryRestrictionEnum.KOSHER,
  },
];

const mealOptions = [
  { label: MealPreferenceEnum.BREAKFAST, value: MealPreferenceEnum.BREAKFAST },
  { label: MealPreferenceEnum.LUNCH, value: MealPreferenceEnum.LUNCH },
  { label: MealPreferenceEnum.DINNER, value: MealPreferenceEnum.DINNER },
  { label: MealPreferenceEnum.SNACKS, value: MealPreferenceEnum.SNACKS },
  {
    label: MealPreferenceEnum.PREFER_NOT_TO_SAY,
    value: MealPreferenceEnum.PREFER_NOT_TO_SAY,
  },
];

const deliveryTimes = [
  { label: DeliveryTimeEnum.MORNING, value: DeliveryTimeEnum.MORNING },
  { label: DeliveryTimeEnum.AFTERNOON, value: DeliveryTimeEnum.AFTERNOON },
  { label: DeliveryTimeEnum.EVENING, value: DeliveryTimeEnum.EVENING },
  { label: DeliveryTimeEnum.NIGHT, value: DeliveryTimeEnum.NIGHT },
  { label: DeliveryTimeEnum.ANYTIME, value: DeliveryTimeEnum.ANYTIME },
];

const paymentMethods = [
  { label: PaymentMethodEnum.CARD, value: PaymentMethodEnum.CARD },
  {
    label: PaymentMethodEnum.MOBILE_MONEY,
    value: PaymentMethodEnum.MOBILE_MONEY,
  },
  {
    label: PaymentMethodEnum.CASH_ON_DELIVERY,
    value: PaymentMethodEnum.CASH_ON_DELIVERY,
  },
];

export function UserPersonalizedDetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack?: () => void;
  stepIndex?: number;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: personalization } = useUserPersonalization({
    userId: user?.id,
  });
  const userPersonalizaton = personalization?.responseData;

  const form = useForm({
    resolver: zodResolver(userPersonalizedSchema),
    defaultValues: {},
    mode: "all",
  });

  useEffect(() => {
    if (!userPersonalizaton) return;
    form.reset({
      preferredCuisines: userPersonalizaton?.preferredCuisines,
      dietaryRestrictions: userPersonalizaton?.dietaryRestrictions,
      mealPreferences: userPersonalizaton?.mealPreferences,
      preferredDeliveryTime: userPersonalizaton?.preferredDeliveryTime,
      paymentPreference: userPersonalizaton?.paymentPreference,
      allergies: userPersonalizaton?.allergies,
    });
  }, [form, userPersonalizaton]);

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
      allergies: data?.allergies ?? "",
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

            <div className="flex justify-end gap-2">
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

//  <CreateEditBusinessForm
//           isEdit={false}
//           initialData={undefined}
//           onSuccess={() => {
//             updateUserData({ onboardingProgress: savedProgress + 1 });
//           }}
//           containerClassName="px-1"
//           onBack={onBack}
//           busy={isUpdatingUserData}
//         />
