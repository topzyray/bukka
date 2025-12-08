import { TBusinessType } from "../types/business";

export interface CreateBusinessDto {
  ownerId: number;
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
  registrationNo?: string;
  openingHours?: any;
  socialLinks?: any;
}

export interface UpdateBusinessDto {
  name: string;
  description?: string;
  type?: TBusinessType;
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

export interface SetFeaturedBusinessDto {
  isFeatured: boolean;
  featuredRank?: number;
  featuredEnd?: Date | string;
}
