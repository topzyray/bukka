import { Restaurant } from "./Restaurant";

export interface Favorite {
  id: string;
  restaurantId: string;
  restaurant: Restaurant;
}
