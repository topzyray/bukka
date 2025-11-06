import { MealPreferenceEnum } from "./../enums/MealPreferenceEnum";
import { DietaryRestrictionEnum } from "../enums/DietRestrictionEnum";
import { DeliveryTimeEnum } from "../enums/DeliveryTimeEnum";
import { PaymentMethodEnum } from "../enums/PaymentMethodEnum";
import { User } from "./User";

export interface UserPersonalization {
  id: number;
  userId: number;
  preferredCuisines: string[];
  dietaryRestrictions: DietaryRestrictionEnum[];
  mealPreferences: MealPreferenceEnum[];
  preferredDeliveryTime: DeliveryTimeEnum;
  paymentPreference: PaymentMethodEnum;
  allergies: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
