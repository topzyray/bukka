import { MealPreferenceEnum } from './../Enums/MealPreferenceEnum';
import { DietaryRestrictionEnum } from '../Enums/DietRestrictionEnum';
import { DeliveryTimeEnum } from '../Enums/DeliveryTimeEnum';
import { PaymentMethodEnum } from '../Enums/PaymentMethodEnum';

export class UserPersonalization {
  id: number;
  userId: number;
  preferredCuisines: string[];
  dietaryRestrictions?: DietaryRestrictionEnum[];
  mealPreferences?: MealPreferenceEnum[];
  preferredDeliveryTime: DeliveryTimeEnum;
  paymentPreference: PaymentMethodEnum;
  allergies?: string;
  user: any;
  createdAt: Date;
  updatedAt: Date;
}
