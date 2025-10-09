"use client";

import { AdminOverview } from "@/components/views/dashboard/admin/overview";
import { BusinessOverview } from "@/components/views/dashboard/business/overview";
import { DefaultOverview } from "@/components/views/dashboard/other/overview-default";
import { UserOverview } from "@/components/views/dashboard/user/overview";
import { useAuth } from "@/providers/auth-provider";
import { UserRoleEnum } from "@/server/enums/UserRoleEnum";

export default function OverviewPage() {
  const { userDetails } = useAuth();

  switch (userDetails?.role) {
    case UserRoleEnum.ADMIN:
      return <AdminOverview />;
    case UserRoleEnum.BUSINESS:
      return <BusinessOverview />;
    case UserRoleEnum.USER:
      return <UserOverview />;
    default:
      return <DefaultOverview />;
  }
}
