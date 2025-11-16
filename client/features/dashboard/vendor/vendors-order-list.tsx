"use client";

import { useAuth } from "@/providers";
import { OrdersListBase } from "../shared/orders-list-base";

export function VendorOrdersList() {
  const { user } = useAuth();

  return (
    <OrdersListBase
      title="Customer Orders"
      description="View all orders placed for your businesses"
      filters={{ vendorId: user?.id }}
      basePath="/dashboard/vendor/orders"
    />
  );
}
