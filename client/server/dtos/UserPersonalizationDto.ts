export type CreateUserPersonalizationDto = {
  preferredCuisines: string[];
  dietaryRestrictions: string[];
  mealPreferences: string[];
  paymentPreference: string;
  preferredDeliveryTime: string;
  allergies?: string;
};

export type UpdateUserPersonalizationDto = {
  personalizationId: number;
  preferredCuisines?: string[];
  dietaryRestrictions?: string[];
  mealPreferences?: string[];
  paymentPreference?: string;
  preferredDeliveryTime?: string;
  allergies?: string;
};
