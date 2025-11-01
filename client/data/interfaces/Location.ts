import { Business } from "./Business";
import { User } from "./User";

export interface Location {
  id: number;
  placeId: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  cityId: string;
  stateId: string;
  countryId: string;
  businesses: Business[];
  users: User[];
  createdAt: Date;
  updatedAt: Date;
}

type LocationSource =
  | "database"
  | "google"
  | "osm"
  | "mapbox"
  | "manual"
  | "reverse";

export interface LocationModel {
  latitude: number;
  longitude: number;
  placeId?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  landmark?: string | null;
  plusCode?: string | null;
  cityId?: string | null;
  stateId?: string | null;
  countryId?: string | null;
  source?: LocationSource;
}

export type LatLng = { lat: number; lng: number };

export const LAGOS = { lat: 6.524379, lng: 3.379206 };
