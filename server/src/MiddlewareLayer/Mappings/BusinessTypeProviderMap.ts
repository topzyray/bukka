export const BUSINESS_TYPE_TO_PROVIDER_MAP = {
  RESTAURANT: {
    google: 'restaurant',
    geoapify: 'catering.restaurant',
  },
  FAST_FOOD: {
    google: 'meal_takeaway',
    geoapify: 'catering.fast_food',
  },
  FOOD_VENDOR: {
    google: 'meal_takeaway',
    geoapify: 'catering.fast_food', // closest valid
  },
  BAR: {
    google: 'bar',
    geoapify: 'catering.bar',
  },
  BAKERY: {
    google: 'bakery',
    geoapify: 'commercial.food_and_drink.bakery',
  },
  LOUNGE: {
    google: 'bar', // no lounge type in Google
    geoapify: 'catering.bar', // closest
  },
  STREET_EATRY: {
    google: 'meal_takeaway',
    geoapify: 'catering.fast_food',
  },
  CATERING: {
    google: 'restaurant', // Google has no 'catering'
    geoapify: 'catering',
  },
  GROCERY: {
    google: 'grocery_or_supermarket',
    geoapify: 'commercial.food_and_drink',
  },
  DELIVERY_SERVICE: {
    google: 'meal_delivery',
    geoapify: 'catering.restaurant', // closest
  },

  // ---- CAFE / DESSERTS  ----
  CAFE: {
    google: 'cafe',
    geoapify: 'catering.cafe',
  },
  DESSERT_SHOP: {
    google: 'bakery',
    geoapify: 'catering.cafe', // closest
  },
  ICE_CREAM_SHOP: {
    google: 'ice_cream',
    geoapify: 'catering.cafe', // closest category
  },

  // ---- SPECIALTIES ----
  PIZZA: {
    google: 'restaurant',
    geoapify: 'catering.restaurant.pizza',
  },
  SEAFOOD: {
    google: 'restaurant',
    geoapify: 'catering.restaurant.seafood',
  },
  STEAK_HOUSE: {
    google: 'restaurant',
    geoapify: 'catering.restaurant.steak_house',
  },
  SUSHI: {
    google: 'restaurant',
    geoapify: 'catering.restaurant.sushi',
  },

  // ---- DIET TYPES ----
  VEGETARIAN: {
    google: 'restaurant',
    geoapify: 'catering.restaurant', // fallback
  },
  VEGAN: {
    google: 'restaurant',
    geoapify: 'catering.restaurant', // fallback
  },

  SUPERMARKET: {
    google: 'grocery_or_supermarket',
    geoapify: 'commercial.supermarket',
  },

  CONVENIENCE_STORE: {
    google: 'convenience_store',
    geoapify: 'commercial.convenience',
  },

  FOOD_TRUCK: {
    google: 'restaurant', // no dedicated type
    geoapify: 'catering.fast_food', // closest
  },

  MEAL_TAKEAWAY: {
    google: 'meal_takeaway',
    geoapify: 'catering.fast_food',
  },

  MEAL_DELIVERY: {
    google: 'meal_delivery',
    geoapify: 'catering.fast_food',
  },

  OTHER: {
    google: 'restaurant',
    geoapify: 'catering',
  },
};
