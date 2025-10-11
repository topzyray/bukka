"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  preferredDeliveryTime: z.enum(["Morning", "Afternoon", "Evening", "Night"]),
  paymentPreferences: z.enum(["Card", "Mobile Money", "Cash on Delivery"]),
  allergies: z.string().max(200).optional(),
});

type UserPersonalizationFormData = z.infer<typeof userPersonalizedSchema>;

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

export function UserPersonalizedDetailsStep({ onNext, onBack, finalize }: any) {
  const { state, actions } = useOnboarding();

  const form = useForm({
    resolver: zodResolver(userPersonalizedSchema),
    // defaultValues: state.roleSpecific ?? {},
    mode: "all",
  });

  const onSubmit = (data: UserPersonalizationFormData) => {
    console.log("DATA: ", data);

    // actions.setRoleSpecific(data);
    // if (finalize) finalize();
    // else onNext?.();
  };

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
        />

        <SelectComponent
          formControl={form.control}
          formName="dietaryRestrictions"
          formLabel="Dietary Restrictions"
          formPlaceholder="Select dietary restrictions"
          formOptionLabel="Dietary Options"
          formOptionData={dietaryOptions}
          multiSelect={true} // Multi-select enabled
        />

        <SelectComponent
          formControl={form.control}
          formName="mealPreferences"
          formLabel="Meal Preferences"
          formPlaceholder="Select meal preferences"
          formOptionLabel="Meal Types"
          formOptionData={mealOptions}
          multiSelect={true} // Multi-select enabled
        />

        <SelectComponent
          formControl={form.control}
          formName="preferredDeliveryTime"
          formLabel="Preferred Delivery Time"
          formPlaceholder="Select delivery time"
          formOptionLabel="Delivery Time"
          formOptionData={deliveryTimes}
        />

        <SelectComponent
          formControl={form.control}
          formName="paymentPreferences"
          formLabel="Preferred Payment Method"
          formPlaceholder="Select payment method"
          formOptionLabel="Payment Method"
          formOptionData={paymentMethods}
        />

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
          <Button type="submit" disabled={!form.formState.isValid}>
            Finish
          </Button>
        </div>
      </form>
    </Form>
  );
}

const CUISINE_OPTIONS: Record<string, string[]> = {
  African: [
    "Nigerian",
    "Ghanaian",
    "Ethiopian",
    "Moroccan",
    "South African",
    "Kenyan",
    "Egyptian",
    "Tunisian",
    "Senegalese",
    "Somali",
  ],
  American: [
    "Southern (Soul Food)",
    "Cajun & Creole",
    "Tex-Mex",
    "Hawaiian",
    "Californian Fusion",
    "Barbecue (BBQ)",
    "New England",
    "Midwestern Comfort",
    "Pacific Northwest",
  ],
  Asian: [
    "Chinese",
    "Japanese",
    "Thai",
    "Korean",
    "Vietnamese",
    "Indian",
    "Pakistani",
    "Indonesian",
    "Filipino",
    "Malaysian",
    "Sri Lankan",
    "Nepalese",
  ],
  European: [
    "Italian",
    "French",
    "Spanish",
    "Greek",
    "British",
    "German",
    "Portuguese",
    "Turkish",
    "Russian",
    "Scandinavian",
  ],
  MiddleEastern: [
    "Lebanese",
    "Persian (Iranian)",
    "Israeli",
    "Syrian",
    "Turkish",
    "Iraqi",
    "Emirati",
    "Saudi Arabian",
  ],
  LatinAmerican: [
    "Mexican",
    "Brazilian",
    "Argentinian",
    "Peruvian",
    "Colombian",
    "Cuban",
    "Puerto Rican",
    "Venezuelan",
    "Chilean",
  ],
  Caribbean: [
    "Jamaican",
    "Trinidadian",
    "Haitian",
    "Barbadian",
    "Cuban",
    "Dominican",
    "Bahamas",
  ],
  Oceanian: ["Australian", "New Zealand", "Polynesian", "Fijian", "Samoan"],
  FusionModern: [
    "Afro-Fusion",
    "Asian-Fusion",
    "Tex-Mex Fusion",
    "Plant-Based",
    "Vegan Fusion",
    "Street Food",
    "Contemporary Global",
  ],
};

const cuisineSuggestions = Object.entries(CUISINE_OPTIONS).flatMap(
  ([region, cuisines]) =>
    cuisines.map(
      (cuisine) => `${region.replace(/([A-Z])/g, " $1").trim()} - ${cuisine}`
    )
);
