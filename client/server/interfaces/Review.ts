import { Business } from "./Business";
import { User } from "./User";

export interface Review {
  id: number;
  userId: number;
  businessId: number;
  rating: number;
  title: string;
  content: string;
  comment: string;
  reply: string;
  mediaUrls: string[];
  business: Business;
  user: User;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
