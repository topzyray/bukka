"use client";

import { OrderDetailsBase } from "../shared/order-details-base";

export function UserOrderDetails({ orderId }: { orderId: number }) {
  return <OrderDetailsBase orderId={orderId} role="user" />;
}
