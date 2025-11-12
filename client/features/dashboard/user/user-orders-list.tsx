"use client";

import { useAuth } from "@/providers";
import { OrdersListBase } from "../shared/orders-list-base";

export function UserOrdersList() {
  const { user } = useAuth();

  return (
    <OrdersListBase
      title="My Orders"
      description="Track all your purchases and deliveries"
      filters={{ customerId: user?.id }}
      basePath="/dashboard/user/orders"
    />
  );
}
