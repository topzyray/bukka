import { Location } from './Location';
import { BusinessCategory } from './BusinessCategory';
import { Review } from './Review';
import { User } from './User';
import { Favorite } from './Favorite';
import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';
import { RecommendationStatusEnum } from '../Enums/RecommendationStatuEnum';

export class Recommendation {
  id: number;
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
  note: string;
  recommenderId: number;
  status: RecommendationStatusEnum;
  locationId: number;
  location: Location;
  category: BusinessCategory;
  recommender: User;
  createdAt: Date;
  updatedAt: Date;
}
