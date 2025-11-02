"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useVendorsOrder } from "@/data/queries";
import { useOrderStatusMutation } from "@/data/mutations/order/use-order-mutation";

export const OrdersTable: React.FC<{ businessId: number }> = ({
  businessId,
}) => {
  const { data, isLoading } = useVendorsOrder();

  const orderMutation = useOrderStatusMutation(businessId);

  if (isLoading) return <div>Loading orders...</div>;
  if (!data || data.length === 0) return <div>No orders</div>;

  return (
    <div className="space-y-2">
      {data.map((order: any) => (
        <div
          key={order.id}
          className="flex items-center justify-between border p-3 rounded-md"
        >
          <div>
            <div className="font-medium">
              {order.customerName} •{" "}
              {order.items.map((i: any) => i.name).join(", ")}
            </div>
            <div className="text-sm text-muted-foreground">
              {order.createdAt}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="text-sm">{order.status}</div>

            {order.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() =>
                    orderMutation.mutate({
                      orderId: order.id,
                      status: "accepted",
                    })
                  }
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    orderMutation.mutate({
                      orderId: order.id,
                      status: "rejected",
                    })
                  }
                >
                  Reject
                </Button>
              </>
            )}

            {order.status === "accepted" && (
              <Button
                size="sm"
                onClick={() =>
                  orderMutation.mutate({
                    orderId: order.id,
                    status: "preparing",
                  })
                }
              >
                Start Preparing
              </Button>
            )}

            {order.status === "preparing" && (
              <Button
                size="sm"
                onClick={() =>
                  orderMutation.mutate({ orderId: order.id, status: "ready" })
                }
              >
                Mark Ready
              </Button>
            )}

            {order.status === "ready" && (
              <Button
                size="sm"
                onClick={() =>
                  orderMutation.mutate({
                    orderId: order.id,
                    status: "dispatched",
                  })
                }
              >
                Dispatch
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
