import { Business } from "./Business";

export interface BusinessCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  type: string;
  iconUrl: string;
  businesses: Business[];
  createdAt: Date;
  updatedAt: Date;
}
