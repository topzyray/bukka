"use client";

import DashboardLayout from "@/components/global/dashboard-layout";
import { RouteGuard } from "@/guards/route-guard";
import { useAuth } from "@/providers";
import { UserRole } from "@/server/interfaces/Auth";

export function RoleBasedDashboardLayoutClient({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const role = user?.role ? (user?.role.toLowerCase() as UserRole) : undefined;
  return (
    <RouteGuard isProtected={true} roles={role ? [role] : []}>
      <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>
    </RouteGuard>
  );
}
