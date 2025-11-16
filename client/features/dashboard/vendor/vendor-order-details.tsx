"use client";

import { OrderDetailsBase } from "../shared/order-details-base";

export function VendorOrderDetails({ orderId }: { orderId: number }) {
  return <OrderDetailsBase orderId={orderId} role="vendor" />;
}
