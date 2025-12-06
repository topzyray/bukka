import { Location } from "./Location";
import { BusinessCategory } from "./BusinessCategory";
import { User } from "./User";
import { BusinessTypeEnum } from "../enums/BusinessTypeEnum";
import { RecommendationStatusEnum } from "../enums";

export interface Recommendation {
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
  ownerId: number;
  status: RecommendationStatusEnum;
  locationId: number;
  location: Location;
  category: BusinessCategory;
  recommender: User;
  createdAt: Date;
  updatedAt: Date;
}
