"use client";

import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/data/queries";

interface Props {
  businessId: string;
}

export const OrderStatusTracker: React.FC<Props> = ({ businessId }) => {
  const { data: orders } = useOrders();

  if (!orders || orders.length === 0) {
    return <p className="text-sm text-muted-foreground">No orders yet.</p>;
  }

  return (
    <div className="space-y-3 mt-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between border p-3 rounded-lg"
        >
          <div>
            <p className="font-medium">{order.itemName}</p>
            <p className="text-sm text-muted-foreground">
              Qty: {order.quantity} •{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <Badge
            variant={
              order.status === "pending"
                ? "secondary"
                : order.status === "confirmed"
                ? "default"
                : "success"
            }
          >
            {order.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};
