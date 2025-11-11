import { Business } from "./Business";
import { User } from "./User";

export interface Review {
  id: number;
  userId: number;
  businessId: number;
  rating: number;
  comment: string;
  reply: any;
  business: Business;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
