import { BusinessTypeEnum } from "../enums/BusinessTypeEnum";

export interface BusinessLike {
  id: number;
  name: string;
  description: string;
  type: BusinessTypeEnum;
  cuisines: string[];
  website?: string;
  phoneNumber?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
  };
  openingHours?: any;
  averageRating: number;
  reviewCount: number;
}
