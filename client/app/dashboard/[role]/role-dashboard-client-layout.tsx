"use client";

import DashboardLayout from "@/components/global/dashboard-layout";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { RouteGuard } from "@/guards/route-guard";
import { useAuth } from "@/providers";
import { UserRole } from "@/server/interfaces/Auth";
import { useEffect, useState } from "react";

export function RoleBasedDashboardLayoutClient({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // During hydration, render a placeholder loader to match SSR output
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularLoader text="Preparing dashboard..." />
      </div>
    );
  }

  const role = user?.role ? (user?.role.toLowerCase() as UserRole) : undefined;
  return (
    <RouteGuard isProtected={true} roles={role ? [role] : []}>
      <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>
    </RouteGuard>
  );
}
