export type BusinessType =
  | "RESTAURANT"
  | "BAR"
  | "LOUNGE"
  | "CATERING"
  | "BAKERY"
  | "FOOD_VENDOR"
  | "STREET_EATRY"
  | "GROCERY"
  | "DELIVERY_SERVICE"
  | "OTHER";

export interface CreateBusinessDto {
  ownerId: number;
  name: string;
  type: BusinessType;
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
  registrationNo?: string;
  openingHours?: any;
  socialLinks?: any;
}

export interface UpdateBusinessDto {
  name: string;
  description?: string;
  type?: BusinessType;
  categoryId?: number | null;
  phoneNumber?: string;
  email?: string;
  website?: string;
  registrationNo?: string;
  locationId?: number | null;
  openingHours?: any;
  socialLinks?: any;
  isVerified?: boolean;
  isActive?: boolean;
  iconUrl?: string | null;
  coverUrl?: string | null;
}

export interface Business {
  id: number;
  ownerId: number;
  name: string;
  description?: string | null;
  type: BusinessType;
  categoryId: number;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  registrationNo?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  rating?: number | null;
  totalReviews?: number | null;
  openingHours?: any;
  socialLinks?: any;
  locationId?: number | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  iconUrl?: string | null;
  coverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
