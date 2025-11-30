export class ProcessOrderCreatedDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  orderId: number;
  businessId: number;
  customerId: number;
  status: string;
  totalAmount?: number;
  customerEmail?: string;
  vendorEmail?: string;
  createdAt?: string;
}
