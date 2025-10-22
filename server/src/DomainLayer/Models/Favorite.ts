import { Business } from './Business';
import { User } from './User';

export class Favorite {
  id: number;
  userId: number;
  businessId: number;
  user: User;
  business: Business;
  createdAt: Date;
  updatedAt: Date;
}
