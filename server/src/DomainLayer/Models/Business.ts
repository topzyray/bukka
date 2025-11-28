import { Location } from './Location';
import { BusinessCategory } from './BusinessCategory';
import { Review } from './Review';
import { User } from './User';
import { Favorite } from './Favorite';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';

export class Business {
  id: number;
  ownerId: number;
  recommenderId: number;
  name: string;
  description: string;
  type: BusinessTypeEnum;
  categoryId: number;
  slug: string;
  phoneNumber: string;
  email: string;
  website: string;
  registrationNo: string;
  cuisines: string[];
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
  recommender: User;
  reviews: Review[];
  favorites: Favorite[];
  createdAt: Date;
  updatedAt: Date;
}
