import { User } from './User';
import { Business } from './Business';
import { OrderStatusEnum } from '../Enums/OrderStatusEnum';

export class Order {
  id: number;
  userId: number;
  vendorId: number;
  riderId: number;
  businessId: number;
  status: OrderStatusEnum;
  totalAmount: number;
  items: any;
  deliveryTime: Date;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  vendor: User;
  rider: User;
  business: Business;
}
