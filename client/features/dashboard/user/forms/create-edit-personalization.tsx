import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { SelectComponent } from "@/components/form-ui/base/select-component";
import { TagInputComponent } from "@/components/form-ui/base/tag-input-component";
import { Button, Form } from "@/components/ui";
import { cuisineSuggestions } from "@/constants/menu-info";
import { DeliveryTimeEnum } from "@/data/enums/DeliveryTimeEnum";
import { DietaryRestrictionEnum } from "@/data/enums/DietRestrictionEnum";
import { MealPreferenceEnum } from "@/data/enums/MealPreferenceEnum";
import { PaymentMethodEnum } from "@/data/enums/PaymentMethodEnum";
import { UserPersonalization } from "@/data/interfaces/UserPersonalization";
import { useAuth } from "@/providers";
import { useCreateUserPersonalization } from "@/data/mutations/userPersonalizaton/use-create-user-personalization";
import { toast } from "sonner";
import { useUpdateUserPersonalization } from "@/data/mutations/userPersonalizaton/use-update-user-personalization";
import { Loader2 } from "lucide-react";

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

interface ICreateEditPersonalizationForm {
  isEdit: boolean;
  busy?: boolean;
  initialData?: Partial<UserPersonalization>;
  onBack?: () => void;
  onSuccess?: () => void;
  setEditProfile?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateEditPersonalizationForm({
  isEdit,
  busy,
  initialData,
  onBack,
  onSuccess,
  setEditProfile,
}: ICreateEditPersonalizationForm) {
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(userPersonalizedSchema),
    defaultValues: {},
    mode: "all",
  });

  useEffect(() => {
    if (isEdit && initialData) {
      form.reset({
        preferredCuisines: initialData?.preferredCuisines,
        dietaryRestrictions: initialData?.dietaryRestrictions,
        mealPreferences: initialData?.mealPreferences,
        preferredDeliveryTime: initialData?.preferredDeliveryTime,
        paymentPreference: initialData?.paymentPreference,
        allergies: initialData?.allergies,
      });
    }
  }, [form, initialData, isEdit]);

  const {
    mutateAsync: createUserPersonalization,
    isPending: isCreatingUserPersonalization,
  } = useCreateUserPersonalization({
    userId: user?.id,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const {
    mutateAsync: updateUserPersonalization,
    isPending: isUpdatingUserPersonalization,
  } = useUpdateUserPersonalization({
    userId: user?.id,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSubmit = (data: UserPersonalizationFormData) => {
    if (!user?.id) {
      toast.error("User not found.", {
        description: "Please sign in again.",
      });
      return;
    }
    const payload = {
      dietaryRestrictions: data.dietaryRestrictions as string[],
      mealPreferences: data.mealPreferences as string[],
      paymentPreference: data.paymentPreference,
      preferredCuisines: data.preferredCuisines,
      preferredDeliveryTime: data.preferredDeliveryTime,
      allergies: data?.allergies ?? "",
    };
    isEdit && initialData
      ? updateUserPersonalization({
          personalizationId: initialData?.id as number,
          ...payload,
        })
      : createUserPersonalization(payload);
  };

  busy = busy || isCreatingUserPersonalization || isUpdatingUserPersonalization;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TagInputComponent
          formControl={form.control}
          formName="preferredCuisines"
          formLabel="Preferred Cuisines"
          formPlaceholder="Type or select cuisines..."
          enableSuggestions
          suggestions={cuisineSuggestions}
          disabled={busy}
        />

        <SelectComponent
          formControl={form.control}
          formName="dietaryRestrictions"
          formLabel="Dietary Restrictions"
          formPlaceholder="Select dietary restrictions"
          formOptionLabel="Dietary Options"
          formOptionData={dietaryOptions}
          multiSelect={true} // Multi-select enabled
          disabled={busy}
        />

        <SelectComponent
          formControl={form.control}
          formName="mealPreferences"
          formLabel="Meal Preferences"
          formPlaceholder="Select meal preferences"
          formOptionLabel="Meal Types"
          formOptionData={mealOptions}
          multiSelect={true} // Multi-select enabled
          disabled={busy}
        />

        <SelectComponent
          formControl={form.control}
          formName="preferredDeliveryTime"
          formLabel="Preferred Delivery Time"
          formPlaceholder="Select delivery time"
          formOptionLabel="Delivery Time"
          formOptionData={deliveryTimes}
          disabled={busy}
        />

        <SelectComponent
          formControl={form.control}
          formName="paymentPreference"
          formLabel="Preferred Payment Method"
          formPlaceholder="Select payment method"
          formOptionLabel="Payment Method"
          formOptionData={paymentMethods}
          disabled={busy}
        />

        <InputComponent
          formControl={form.control}
          formName="allergies"
          formLabel="Allergies or Sensitivities"
          formInputType="text"
          formPlaceholder="List any allergies..."
          disabled={busy}
        />

        <div className="flex justify-end gap-2">
          {onBack && (
            <Button variant="ghost" onClick={onBack} disabled={busy}>
              Back
            </Button>
          )}
          {!onBack && isEdit && setEditProfile && (
            <Button onClick={() => setEditProfile?.(false)}>Cancel</Button>
          )}
          <Button type="submit" disabled={!form.formState.isValid || busy}>
            {busy ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Saving
              </span>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
