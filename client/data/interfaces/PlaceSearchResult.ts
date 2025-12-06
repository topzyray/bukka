export interface PlaceSearchResult {
  externalId: string; // place_id for Google, place_id for LocationIQ (or id)
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  types?: string[]; // provider-specific categories
  raw?: any; // raw provider payload
}
