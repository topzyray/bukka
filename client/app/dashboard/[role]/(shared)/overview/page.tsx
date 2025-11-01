"use client";

import { AdminOverview } from "@/features/dashboard/admin/overview";
import { VendorOverview } from "@/features/dashboard/vendor/overview";
import { DefaultOverview } from "@/features/dashboard/other/overview-default";
import { UserOverview } from "@/features/dashboard/user/overview";
import { UserRoleEnum } from "@/data/enums";
import { useCurrentUser } from "@/data/queries";

export default function OverviewPage() {
  const { data: user } = useCurrentUser();

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
