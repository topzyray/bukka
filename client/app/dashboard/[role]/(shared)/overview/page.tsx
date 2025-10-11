"use client";

import { AdminOverview } from "@/components/views/dashboard/admin/overview";
import { BusinessOverview } from "@/components/views/dashboard/business/overview";
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
      return <BusinessOverview />;
    case UserRoleEnum.USER:
      return <UserOverview />;
    default:
      return <DefaultOverview />;
  }
}
