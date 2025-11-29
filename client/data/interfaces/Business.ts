import { Location } from "./Location";
import { BusinessCategory } from "./BusinessCategory";
import { Review } from "./Review";
import { User } from "./User";
import { Favorite } from "./Favorite";
import { BusinessTypeEnum } from "../enums/BusinessTypeEnum";

export interface Business {
  id: number;
  ownerId: number;
  recommenderId: number;
  name: string;
  description: string;
  type: BusinessTypeEnum;
  slug: string;
  phoneNumber: string;
  email: string;
  website: string;
  registrationNo: string;
  cuisines: string[] | [];
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
  recommender: User;
  createdAt: Date;
  updatedAt: Date;
}
