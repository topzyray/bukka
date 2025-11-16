"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { List, Table } from "lucide-react";
import { BukkaButton } from "@/components/ui";
import { useAuth } from "@/providers";
import { OrdersListBase } from "./orders-list-base";
import { OrdersTableBase } from "./orders-table-base";

export function OrdersViewSwitcher({
  role,
}: {
  role: "user" | "vendor" | "rider";
}) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read from query param ?view=table or ?view=list
  const queryView = searchParams.get("view") as "list" | "table" | null;

  const [viewMode, setViewMode] = useState<"list" | "table">("list");

  // Load from URL or localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`${role}-orders-view`);
    if (queryView) {
      setViewMode(queryView);
    } else if (saved === "table" || saved === "list") {
      setViewMode(saved);
    }
  }, [role, queryView]);

  // Persist in localStorage and URL
  useEffect(() => {
    localStorage.setItem(`${role}-orders-view`, viewMode);

    // Update URL param without reload
    const params = new URLSearchParams(searchParams);
    params.set("view", viewMode);
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const getFilters = () => {
    if (role === "user") return { customerId: user?.id };
    if (role === "vendor") return { vendorId: user?.id };
    if (role === "rider") return { riderId: user?.id };
    return {};
  };

  const basePath = `/dashboard/${role}/orders`;

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {role === "user"
              ? "My Orders"
              : role === "vendor"
              ? "Business Orders"
              : "Assigned Deliveries"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {role === "user"
              ? "Track all your purchases and deliveries"
              : role === "vendor"
              ? "View all orders placed for your businesses"
              : "Manage and track your assigned deliveries"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BukkaButton
            size="sm"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List size={16} className="mr-1" /> List
          </BukkaButton>
          <BukkaButton
            size="sm"
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
          >
            <Table size={16} className="mr-1" /> Table
          </BukkaButton>
        </div>
      </header>

      {viewMode === "list" ? (
        <OrdersListBase
          title=""
          description=""
          filters={getFilters()}
          basePath={basePath}
        />
      ) : (
        <OrdersTableBase
          title=""
          description=""
          filters={getFilters()}
          basePath={basePath}
        />
      )}
    </section>
  );
}
