import { Business } from './Business';

export class Service {
  id: number;
  businessId: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  business: Business;
}
