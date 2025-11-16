import { Business } from "./Business";
import { User } from "./User";

export interface Order {
  id: string;
  businessId: string;
  itemName: string;
  quantity: number;
  business: Business;
  user: User;
  rider: User;
  vendor: User;
  totalAmount: number;
  note?: string;
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
}
