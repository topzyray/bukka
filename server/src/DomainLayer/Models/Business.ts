import { Location } from './Location';
import { BusinessCategory } from './BusinessCategory';
import { Review } from './Review';
import { User } from './User';
import { Favorite } from './Favorite';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';

export class Business {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  type: BusinessTypeEnum;
  categoryId: number;
  phoneNumber: string;
  email: string;
  website: string;
  registrationNo: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  openingHours: any;
  socialLinks: any;
  locationId: number;
  averageRating: number;
  reviewCount: number;
  location: Location;
  category: BusinessCategory;
  owner: User;
  reviews: Review[];
  favorites: Favorite[];
  createdAt: Date;
  updatedAt: Date;
}
