"use client";

import { User } from "@/data/interfaces/User";
import { DashBoardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardConfig } from "@/utils";
import { UserRoleEnum } from "@/data/enums";
import { useAuth } from "@/providers/auth-provider";
import { DashboardHeader } from "../dashboard/dashboard-header";
import {
  BackButton,
  PageWrapper,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperHeader,
  Separator,
} from "../ui";

interface IDashboardLayout {
  defaultOpen: boolean;
  children: React.ReactNode;
}

export function DashboardLayout({
  defaultOpen,
  children,
}: Readonly<IDashboardLayout>) {
  const { user } = useAuth();

  const { navItems, title } = getDashboardConfig(user?.role as UserRoleEnum);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashBoardSidebar navItems={navItems} />
      <main className="relative max-h-screen w-full">
        <DashboardHeader dashboardTitle={title} userData={user as User} />
        <PageWrapper className="pt-14 w-full">
          <PageWrapperHeader className="mt-4">
            <BackButton />
          </PageWrapperHeader>
          <PageWrapperContent className="h-full">
            <PageWrapperContentWithFramer className="h-full">
              <Separator className="border-2" />
              {children}
            </PageWrapperContentWithFramer>
          </PageWrapperContent>
        </PageWrapper>
      </main>
    </SidebarProvider>
  );
}
