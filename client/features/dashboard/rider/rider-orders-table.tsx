"use client";

import { useAuth } from "@/providers";
import { OrdersTableBase } from "../shared/orders-table-base";

export function RiderOrdersTable() {
  const { user } = useAuth();

  return (
    <OrdersTableBase
      title="Assigned Deliveries"
      description="Deliveries currently or previously assigned to you"
      filters={{ riderId: user?.id }}
      basePath="/dashboard/rider/orders"
    />
  );
}
