import { TBusinessType } from "../types/business";

export interface CreateRecommendationDto {
  name: string;
  type: TBusinessType;
  categoryId: number;
  slug: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  cuisines?: string[] | [];
  placeId?: string;
  cityId?: string;
  stateId?: string;
  countryId?: string;
  zipCode?: string;
  landmark?: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
}
