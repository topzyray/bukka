"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { queryClient } from "@/lib";
import { Loader2, PackageSearch } from "lucide-react";
import { BukkaButton } from "@/components/ui";
import { PaginationHelper } from "@/helpers/pagination-helper";
import { TextHelper } from "@/helpers";
import { Order } from "@/data/interfaces/Order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrdersQuery } from "@/data/queries";
import { QueryKeyEnum } from "@/data/enums";

export function OrdersTableBase({
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

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useOrdersQuery({
    filters,
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
      queryKey: [QueryKeyEnum.ORDERS],
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
        <div className="flex justify-center py-12">
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
          <BukkaButton asChild>
            <Link href="/businesses">Explore Businesses</Link>
          </BukkaButton>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Total (₦)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: Order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <Link
                        href={`${basePath}/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        {order.business?.name || "—"}
                      </Link>
                    </TableCell>
                    <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {TextHelper.smartTimeAgo(new Date(order.createdAt))}
                    </TableCell>
                    <TableCell>
                      <Link href={`${basePath}/${order.id}`}>
                        <BukkaButton variant="outline" size="sm">
                          View
                        </BukkaButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {total > PAGE_SIZE && (
            <div className="flex justify-center pt-6">
              {Array.from({ length: Math.ceil(total / PAGE_SIZE) }).map(
                (_, i) => (
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
                )
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
