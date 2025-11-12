"use client";

import { useAuth } from "@/providers";
import { OrdersListBase } from "../shared/orders-list-base";

export function RiderOrdersList() {
  const { user } = useAuth();

  return (
    <OrdersListBase
      title="Assigned Deliveries"
      description="Manage and track your assigned deliveries"
      filters={{ riderId: user?.id }}
      basePath="/dashboard/rider/orders"
    />
  );
}
