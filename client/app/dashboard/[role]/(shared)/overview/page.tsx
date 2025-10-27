"use client";

import { AdminOverview } from "@/components/views/dashboard/admin/overview";
import { VendorOverview } from "@/components/views/dashboard/vendor/overview";
import { DefaultOverview } from "@/components/views/dashboard/other/overview-default";
import { UserOverview } from "@/components/views/dashboard/user/overview";
import { UserRoleEnum } from "@/server/enums";
import { useCurrentUser } from "@/server/queries";

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
