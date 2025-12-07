import { PlaceProviderEnum } from 'src/DomainLayer/Enums/PlaceProviderEnum';
import { BusinessTypeEnum } from 'src/DomainLayer/Enums/BusinessTypeEnum';

type ProviderCategoryMap = Record<BusinessTypeEnum, string>;

const GEOAPIFY_MAP: ProviderCategoryMap = {
  [BusinessTypeEnum.RESTAURANT]: 'catering.restaurant',
  [BusinessTypeEnum.FAST_FOOD]: 'catering.fast_food',
  [BusinessTypeEnum.FOOD_VENDOR]: 'catering.food',
  [BusinessTypeEnum.BAR]: 'catering.bar',
  [BusinessTypeEnum.BAKERY]: 'commercial.food_and_drink.bakery',
  [BusinessTypeEnum.LOUNGE]: 'catering.bar', // closest category
  [BusinessTypeEnum.STREET_EATRY]: 'catering.street_food',
  [BusinessTypeEnum.CATERING]: 'catering',
  [BusinessTypeEnum.GROCERY]: 'commercial.food_and_drink',
  [BusinessTypeEnum.DELIVERY_SERVICE]: 'service.delivery',
  [BusinessTypeEnum.CAFE]: 'catering.cafe',
  [BusinessTypeEnum.DESSERT_SHOP]: 'catering.cafe.dessert',
  [BusinessTypeEnum.ICE_CREAM_SHOP]: 'catering.cafe.ice_cream',
  [BusinessTypeEnum.PIZZA]: 'catering.restaurant.pizza',
  [BusinessTypeEnum.SEAFOOD]: 'catering.restaurant.seafood',
  [BusinessTypeEnum.STEAK_HOUSE]: 'catering.restaurant.steak_house',
  [BusinessTypeEnum.SUSHI]: 'catering.restaurant.sushi',
  [BusinessTypeEnum.VEGETARIAN]: 'catering.restaurant.vegetarian',
  [BusinessTypeEnum.VEGAN]: 'catering.restaurant.vegan',
  [BusinessTypeEnum.SUPERMARKET]: 'commercial.supermarket',
  [BusinessTypeEnum.CONVENIENCE_STORE]: 'commercial.convenience',
  [BusinessTypeEnum.FOOD_TRUCK]: 'catering.street_food',
  [BusinessTypeEnum.MEAL_TAKEAWAY]: 'catering.fast_food',
  [BusinessTypeEnum.MEAL_DELIVERY]: 'service.delivery',
  [BusinessTypeEnum.OTHER]: 'catering',
};

const GOOGLE_MAP: ProviderCategoryMap = {
  [BusinessTypeEnum.RESTAURANT]: 'restaurant',
  [BusinessTypeEnum.FAST_FOOD]: 'restaurant',
  [BusinessTypeEnum.FOOD_VENDOR]: 'restaurant',
  [BusinessTypeEnum.BAR]: 'bar',
  [BusinessTypeEnum.BAKERY]: 'bakery',
  [BusinessTypeEnum.LOUNGE]: 'bar',
  [BusinessTypeEnum.STREET_EATRY]: 'restaurant',
  [BusinessTypeEnum.CATERING]: 'restaurant',
  [BusinessTypeEnum.GROCERY]: 'grocery_or_supermarket',
  [BusinessTypeEnum.DELIVERY_SERVICE]: 'meal_delivery',
  [BusinessTypeEnum.CAFE]: 'cafe',
  [BusinessTypeEnum.DESSERT_SHOP]: 'bakery',
  [BusinessTypeEnum.ICE_CREAM_SHOP]: 'ice_cream_shop',
  [BusinessTypeEnum.PIZZA]: 'restaurant',
  [BusinessTypeEnum.SEAFOOD]: 'restaurant',
  [BusinessTypeEnum.STEAK_HOUSE]: 'restaurant',
  [BusinessTypeEnum.SUSHI]: 'restaurant',
  [BusinessTypeEnum.VEGETARIAN]: 'restaurant',
  [BusinessTypeEnum.VEGAN]: 'restaurant',
  [BusinessTypeEnum.SUPERMARKET]: 'grocery_or_supermarket',
  [BusinessTypeEnum.CONVENIENCE_STORE]: 'convenience_store',
  [BusinessTypeEnum.FOOD_TRUCK]: 'restaurant',
  [BusinessTypeEnum.MEAL_TAKEAWAY]: 'meal_takeaway',
  [BusinessTypeEnum.MEAL_DELIVERY]: 'meal_delivery',
  [BusinessTypeEnum.OTHER]: 'restaurant',
};

export class PlaceCategoryResolver {
  static resolve(
    provider: PlaceProviderEnum,
    businessType: BusinessTypeEnum,
  ): string | null {
    switch (provider) {
      case PlaceProviderEnum.GEOAPIFY:
        return GEOAPIFY_MAP[businessType.toUpperCase()] ?? null;
      case PlaceProviderEnum.GOOGLE:
        return GOOGLE_MAP[businessType.toUpperCase()] ?? null;
      default:
        return null;
    }
  }
}
