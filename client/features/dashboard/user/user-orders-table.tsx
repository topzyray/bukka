"use client";

import { useAuth } from "@/providers";
import { OrdersTableBase } from "../shared/orders-table-base";

export function UserOrdersTable() {
  const { user } = useAuth();

  return (
    <OrdersTableBase
      title="My Orders"
      description="All your past and active orders"
      filters={{ customerId: user?.id }}
      basePath="/dashboard/user/orders"
    />
  );
}
