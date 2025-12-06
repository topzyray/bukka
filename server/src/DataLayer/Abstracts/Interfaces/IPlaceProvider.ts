import { BusinessTypeEnum } from 'src/DomainLayer/Enums/BusinessTypeEnum';

export interface PlaceSearchResult {
  externalId: string; // place_id for Google, place_id for LocationIQ (or id)
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  types?: string[]; // provider-specific categories
  raw?: any; // raw provider payload
}

export interface PlaceDetail extends PlaceSearchResult {
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  openingHours?: string[] | null;
  photos?: string[]; // optional list of photo references / urls
  raw?: any;
}

export interface PlaceProviderSearchOptions {
  category: BusinessTypeEnum;
  lat: number;
  lng: number;
  query: string;
  radius: number; // in meters
  limit: number;
}

export interface IPlaceProvider {
  search(options: PlaceProviderSearchOptions): Promise<PlaceSearchResult[]>;
  getDetails(placeId: string): Promise<PlaceDetail | null>;
}
