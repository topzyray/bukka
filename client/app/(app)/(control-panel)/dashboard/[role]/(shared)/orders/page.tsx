"use client";

import { UserRoleEnum } from "@/data/enums";
import { AdminOrders } from "@/features/dashboard/admin/admin-order-switcher";
import { RiderOrders } from "@/features/dashboard/rider/rider-order-switcher";
import { UserOrders } from "@/features/dashboard/user/user-orders-switcher";
import { VendorOrders } from "@/features/dashboard/vendor/vendor-order-switcher";
import { useAuth } from "@/providers";
import { redirect } from "next/navigation";

export default function OrdersPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <AdminOrders />;
    case UserRoleEnum.VENDOR:
      return <VendorOrders />;
    case UserRoleEnum.RIDER:
      return <RiderOrders />;
    case UserRoleEnum.USER:
      return <UserOrders />;
    default:
      return redirect(`/dashboard/${user?.role.toLowerCase()}/overview`);
  }
}
