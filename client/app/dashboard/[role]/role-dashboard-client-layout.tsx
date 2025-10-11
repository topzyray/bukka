"use client";

import React, { useEffect } from "react";
import DashboardLayout from "@/components/global/dashboard-layout";
import { usePathname, useRouter } from "next/navigation";
import { RouteGuard } from "@/guards/route-guard";
import { UserRoleEnum } from "@/server/enums";
import { useAuth } from "@/providers";
import { getAllowedRoutesForRole } from "@/utils";

export function RoleBasedDashboardLayoutClient({
  defaultOpen,
  children,
  params,
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const unwrappedParams = React.use(params);
  const currentRole = unwrappedParams.role.toLowerCase() as UserRoleEnum;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    const userRole = user?.role.toLowerCase();
    const allowedRoutes = getAllowedRoutesForRole(userRole as UserRoleEnum);
    const isRoleMismatch = userRole !== currentRole;
    const isNotAllowed = !allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!user?.isUpdated) {
      router.replace(`/onboarding/${userRole}`);
      return;
    }

    if (isRoleMismatch || isNotAllowed) {
      const overviewPath = `/dashboard/${userRole}/overview`;
      if (pathname !== overviewPath) {
        router.replace(overviewPath);
      }
      return;
    }
  }, [isLoading, user, currentRole, pathname, router]);

  if (isLoading || !user) return null;

  const userRole = user?.role.toLowerCase();
  if (userRole !== currentRole) return null;

  return (
    <RouteGuard isProtected={true} roles={[user.role]}>
      <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>
    </RouteGuard>
  );
}
