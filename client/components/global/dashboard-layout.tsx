"use client";

import { User } from "@/server/interfaces/User";
import { DashBoardSidebar } from "@/components/global/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardConfig } from "@/utils/dashboard-confg-utils";
import { UserRoleEnum } from "@/server/enums/UserRoleEnum";
import { useAuth } from "@/providers/auth-provider";
import { DashboardHeader } from "./dashboard-header";

interface IDashboardLayout {
  defaultOpen: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({
  defaultOpen,
  children,
}: Readonly<IDashboardLayout>) {
  const { userDetails } = useAuth();

  const { navItems, title } = getDashboardConfig(
    userDetails?.role as UserRoleEnum
  );

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashBoardSidebar navItems={navItems} />
      <main className="relative max-h-screen w-full">
        <DashboardHeader
          dashboardTitle={title}
          userData={userDetails as User}
        />
        <section className="flex pt-14">
          <section className="w-full p-4 sm:p-4">{children}</section>
        </section>
      </main>
    </SidebarProvider>
  );
}
