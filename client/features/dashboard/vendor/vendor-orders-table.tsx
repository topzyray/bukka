"use client";

import { useAuth } from "@/providers";
import { OrdersTableBase } from "../shared/orders-table-base";

export function VendorOrdersTable() {
  const { user } = useAuth();

  return (
    <OrdersTableBase
      title="Business Orders"
      description="Orders received across your businesses"
      filters={{ vendorId: user?.id }}
      basePath="/dashboard/vendor/orders"
    />
  );
}
