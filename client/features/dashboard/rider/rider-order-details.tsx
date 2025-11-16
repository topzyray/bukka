"use client";

import { OrderDetailsBase } from "../shared/order-details-base";

export function RiderOrderDetails({ orderId }: { orderId: number }) {
  return <OrderDetailsBase orderId={orderId} role="rider" />;
}
