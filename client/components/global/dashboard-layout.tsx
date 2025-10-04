"use client";

import { DashBoardSidebar } from "@/components/global/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useContext, useEffect } from "react";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import DashboardHeader from "./dashboard-header";
import { DashboardTitleType, NavItems } from "@/types";
import { UserRole } from "@/api/interfaces/Auth";
import { useAuth } from "@/api/hooks/auth/use-auth.hook";
import { RouteGuard } from "@/guards/RouteGuard";
import { User } from "@/api/interfaces/User";

interface IDashboardLayout {
  navItems: NavItems;
  role: UserRole;
  dashboardTitle: DashboardTitleType;
  defaultOpen: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({
  navItems,
  role,
  dashboardTitle,
  children,
}: Readonly<IDashboardLayout>) {
  const { userDetails: userData } = useAuth();

  return (
    <RouteGuard protected roles={[role]}>
      <SidebarProvider defaultOpen>
        <DashBoardSidebar navItems={navItems} />
        <main className="relative max-h-screen w-full">
          <DashboardHeader
            dashboardTitle={dashboardTitle}
            userData={userData as User}
          />
          <section className="flex pt-14">
            <section className="w-full p-4 sm:p-4">{children}</section>
          </section>
        </main>
      </SidebarProvider>
    </RouteGuard>
  );
}
