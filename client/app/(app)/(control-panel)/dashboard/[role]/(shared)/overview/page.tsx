"use client";

import { AdminOverview } from "@/features/dashboard/admin/overview";
import { VendorOverview } from "@/features/dashboard/vendor/overview";
import { DefaultOverview } from "@/features/dashboard/other/overview-default";
import { UserOverview } from "@/features/dashboard/user/overview";
import { UserRoleEnum } from "@/data/enums";
import { useAuth } from "@/providers";

export default function OverviewPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <AdminOverview />;
    case UserRoleEnum.VENDOR:
      return <VendorOverview />;
    case UserRoleEnum.USER:
      return <UserOverview />;
    default:
      return <DefaultOverview />;
  }
}
