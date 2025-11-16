import { Business } from './Business';

export class Menu {
  id: number;
  businessId: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  business: Business;
}
