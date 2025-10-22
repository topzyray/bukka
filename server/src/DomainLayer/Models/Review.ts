import { Business } from './Business';
import { User } from './User';

export class Review {
  id: number;
  userId: number;
  businessId: number;
  rating: number;
  comment: string;
  business: Business;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
