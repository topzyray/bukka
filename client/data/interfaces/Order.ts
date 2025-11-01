export interface Order {
  id: string;
  businessId: string;
  itemName: string;
  quantity: number;
  note?: string;
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
}
