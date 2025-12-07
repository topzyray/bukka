import { Business } from './Business';
import { User } from './User';

export class Location {
  id: number;
  placeId: string;
  latitude: number;
  longitude: number;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  county?: string;
  zipCode?: string;
  landmark?: string;
  suburb?: string;
  plusCode?: string;
  cityId?: string;
  stateId?: string;
  countryId?: string;
  businesses?: Business[];
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
}
