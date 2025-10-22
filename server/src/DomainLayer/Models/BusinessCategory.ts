import { BusinessTypeEnum } from '../Enums/BusinessTypeEnum';
import { Business } from './Business';

export class BusinessCategory {
  id: number;
  name: string;
  slug: string;
  type: BusinessTypeEnum;
  description: string;
  iconUrl: string;
  createdBy: number;
  businesses: Business[];
  createdAt: Date;
  updatedAt: Date;
}
