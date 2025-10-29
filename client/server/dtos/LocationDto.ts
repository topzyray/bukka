export type UpdateLocationDto = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  placeId?: string;
  cityId?: string;
  stateId?: string;
  countryId?: string;
  zipCode?: string;
  landmark?: string;
};
