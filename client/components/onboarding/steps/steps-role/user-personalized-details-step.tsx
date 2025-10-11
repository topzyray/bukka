"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investorDetailsSchema } from "@/server/schemas/onboarding";
import { useOnboarding } from "@/providers/onboarding-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputComponent from "@/components/forms/base/input-component";
import SelectComponent from "@/components/forms/base/select-component";
import { TagInputComponent } from "@/components/forms/base/tag-input-component";

export const userPersonalizedSchema = z.object({
  preferredCuisines: z
    .array(z.string())
    .min(1, "Please select at least one cuisine"),
  dietaryRestrictions: z
    .array(z.enum(["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher"]))
    .optional(),
  mealPreferences: z
    .array(z.enum(["Breakfast", "Lunch", "Dinner", "Snacks"]))
    .optional(),
  preferredDeliveryTimes: z.enum(["Morning", "Afternoon", "Evening", "Night"]),
  paymentPreferences: z.enum(["Card", "Mobile Money", "Cash on Delivery"]),
  allergies: z.string().max(200).optional(),
});

const dietaryOptions = [
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Gluten-Free", value: "Gluten-Free" },
  { label: "Halal", value: "Halal" },
  { label: "Kosher", value: "Kosher" },
];

const mealOptions = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snacks", value: "Snacks" },
];

const deliveryTimes = [
  { label: "Morning", value: "Morning" },
  { label: "Afternoon", value: "Afternoon" },
  { label: "Evening", value: "Evening" },
  { label: "Night", value: "Night" },
];

const paymentMethods = [
  { label: "Card", value: "Card" },
  { label: "Mobile Money", value: "Mobile Money" },
  { label: "Cash on Delivery", value: "Cash on Delivery" },
];

export default function UserPersonalizedDetailsStep({
  onNext,
  onBack,
  finalize,
}: any) {
  const { state, actions } = useOnboarding();

  const form = useForm({
    resolver: zodResolver(userPersonalizedSchema),
    defaultValues: state.roleSpecific ?? {},
    mode: "all",
  });

  const submit = (data: any) => {
    actions.setRoleSpecific(data);
    if (finalize) finalize();
    else onNext?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        {/* Preferred Cuisines */}
        <TagInputComponent
          formControl={form.control}
          formName="preferredCuisines"
          formLabel="Preferred Cuisines"
          formPlaceholder="Add cuisines..."
          enableSuggestions
          suggestions={[
            "Nigerian",
            "Continental",
            "Italian",
            "Chinese",
            "Fast Food",
            "Vegan",
          ]}
        />

        {/* Dietary Restrictions (multi-select) */}
        <SelectComponent
          formControl={form.control}
          formName="dietaryRestrictions"
          formLabel="Dietary Restrictions"
          formPlaceholder="Select dietary restrictions"
          formOptionLabel="Dietary Options"
          formOptionData={dietaryOptions}
          multiSelect={true} // Multi-select enabled
        />

        {/* Meal Preferences (multi-select) */}
        <SelectComponent
          formControl={form.control}
          formName="mealPreferences"
          formLabel="Meal Preferences"
          formPlaceholder="Select meal preferences"
          formOptionLabel="Meal Types"
          formOptionData={mealOptions}
          multiSelect={true} // Multi-select enabled
        />

        {/* Preferred Delivery Times */}
        <SelectComponent
          formControl={form.control}
          formName="preferredDeliveryTimes"
          formLabel="Preferred Delivery Time"
          formPlaceholder="Select delivery time"
          formOptionLabel="Delivery Time"
          formOptionData={deliveryTimes}
        />

        {/* Payment Preferences */}
        <SelectComponent
          formControl={form.control}
          formName="paymentPreferences"
          formLabel="Preferred Payment Method"
          formPlaceholder="Select payment method"
          formOptionLabel="Payment Method"
          formOptionData={paymentMethods}
        />

        {/* Allergies */}
        <InputComponent
          formControl={form.control}
          formName="allergies"
          formLabel="Allergies or Sensitivities"
          formInputType="text"
          formPlaceholder="List any allergies..."
        />

        <div className="flex gap-2">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Finish</Button>
        </div>
      </form>
    </Form>
  );
}
