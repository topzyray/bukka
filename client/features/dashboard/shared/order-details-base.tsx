"use client";

import Link from "next/link";
import { Loader2, ArrowLeft, Package, Truck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BukkaButton } from "@/components/ui";
import { TextHelper } from "@/helpers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOrderDetailsQuery } from "@/data/queries";

export function OrderDetailsBase({
  orderId,
  role,
}: {
  orderId: number;
  role: "user" | "vendor" | "rider";
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useOrderDetailsQuery({ orderId });

  const order = data?.responseData;

  const handleMarkDelivered = async () => {
    try {
      // (You’ll integrate actual API call here)
      toast.success("Order marked as delivered.");
    } catch (err) {
      toast.error("Failed to update order.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin mr-2" /> Loading order details...
      </div>
    );

  if (isError || !order)
    return <p className="text-red-500 text-center">Failed to load order.</p>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <BukkaButton
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back
        </BukkaButton>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package size={20} />
              <span>Order #{order.id}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {TextHelper.smartTimeAgo(new Date(order.createdAt))}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Business</h3>
            <Link
              href={`/businesses/${order.businessId}`}
              className="text-primary hover:underline"
            >
              {order.business?.name}
            </Link>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Customer</h3>
            <p>{order.user?.firstName}</p>
            <p className="text-sm text-muted-foreground">{order.user?.email}</p>
          </div>

          {order.rider && (
            <div>
              <h3 className="font-semibold text-lg mb-1">Assigned Rider</h3>
              <p>{order.rider?.firstName}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-1">Order Summary</h3>
            <p>Total Amount: ₦{order.totalAmount.toLocaleString()}</p>
            <p>Status: {order.status}</p>
          </div>
        </CardContent>
      </Card>

      {role === "rider" && order.status !== "delivered" && (
        <BukkaButton size="lg" className="w-full" onClick={handleMarkDelivered}>
          <Truck className="mr-2" /> Mark as Delivered
        </BukkaButton>
      )}

      {role === "vendor" && order.status === "pending" && (
        <BukkaButton
          size="lg"
          className="w-full"
          onClick={() => toast.success("Order accepted")}
        >
          <CheckCircle2 className="mr-2" /> Accept Order
        </BukkaButton>
      )}
    </section>
  );
}
