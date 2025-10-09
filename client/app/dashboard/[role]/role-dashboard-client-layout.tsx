"use client";

import React, { useEffect } from "react";
import DashboardLayout from "@/components/global/dashboard-layout";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { RouteGuard } from "@/guards/route-guard";
import { UserRoleEnum } from "@/server/enums/UserRoleEnum";
import { getAllowedRoutesForRole } from "@/utils/route-access-utils";

export function RoleBasedDashboardLayoutClient({
  defaultOpen,
  children,
  params,
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { userDetails, loading } = useAuth();

  const unwrappedParams = React.use(params);
  const currentRole = unwrappedParams.role.toLowerCase() as UserRoleEnum;

  useEffect(() => {
    if (loading) return;

    if (!userDetails) {
      router.replace("/signin");
      return;
    }

    const userRole = userDetails?.role.toLowerCase();
    const allowedRoutes = getAllowedRoutesForRole(userRole as UserRoleEnum);
    const isRoleMismatch = userRole !== currentRole;
    const isNotAllowed = !allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!userDetails?.isUpdated) {
      router.replace(`/onboarding/${userRole}`);
    }

    // if (isRoleMismatch || isNotAllowed) {
    //   console.log("INSIDE ROLE DASHBOARD CLIENT LAYOUT");

    //   router.replace(`/dashboard/${userRole}/overview`);
    // }
  }, [loading, userDetails, currentRole, pathname, router]);

  if (loading || !userDetails) return null;

  const userRole = userDetails?.role.toLowerCase();
  if (userRole !== currentRole) return null;

  return (
    <RouteGuard isProtected={true} roles={[userDetails.role]}>
      <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>
    </RouteGuard>
  );
}
