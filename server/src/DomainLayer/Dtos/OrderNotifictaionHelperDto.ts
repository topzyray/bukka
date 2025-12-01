import { UserRoleEnum } from '../Enums/UserRoleEnum';

export class ProcessOrderCreatedDto {
  orderId: number;
  customerId: number;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerRole: UserRoleEnum;
  businessId: number;
  status: string;
  totalAmount: number;
  vendorId: number;
  vendorEmail: string;
  vendorFirstName: string;
  vendorLastName: string;
}

export class ProcessOrderStatusDto {
  orderId: number;
  customerId: number;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerRole: UserRoleEnum;
  businessId: number;
  status: string;
  totalAmount: number;
  vendorId: number;
  vendorEmail: string;
  vendorFirstName: string;
  vendorLastName: string;
}
