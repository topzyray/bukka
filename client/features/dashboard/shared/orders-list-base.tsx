"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BukkaButton } from "@/components/ui";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { TextHelper } from "@/helpers";
import { Order } from "@/data/interfaces/Order";
import { useOrdersQuery } from "@/data/queries";

export function OrdersListBase({
  title,
  description,
  filters,
  basePath,
}: {
  title: string;
  description: string;
  filters: Record<string, any>;
  basePath: string;
}) {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useOrdersQuery({
    filters: { ...filters },
    pageNumber: page,
    pageSize: PAGE_SIZE,
    enabled: true,
  });

  const orders = data?.responseData?.data ?? [];
  const total = data?.responseData?.total ?? 0;

  const goToPage = async (pn: number) => {
    await PaginationHelper.goToPage({
      pn,
      total,
      pageSize: PAGE_SIZE,
      queryClient,
      queryKey: ["orders"],
      setPage,
    });
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin mr-2" /> Loading orders...
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load orders. Try again later.</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <PackageSearch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            You don’t have any orders yet.
          </p>
          <BukkaButton>
            <Link href="/businesses">Start Shopping</Link>
          </BukkaButton>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <Link
                    href={`${basePath}/${order.id}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {order.business?.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {TextHelper.smartTimeAgo(new Date(order.createdAt))}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>
                    Order Total: ₦{order.totalAmount.toLocaleString()}
                  </span>
                  <span>Status: {order.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex justify-center pt-6">
          {Array.from({ length: Math.ceil(total / PAGE_SIZE) }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm ${
                page === i + 1
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
