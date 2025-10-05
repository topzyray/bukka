import { DashBoardSidebar } from "@/components/global/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardTitleType, NavItems } from "@/types";
import { UserRole } from "@/server/interfaces/Auth";
import { useAuth } from "@/server/hooks/auth/use-auth.hook";
import { RouteGuard } from "@/guards/RouteGuard";
import { User } from "@/server/interfaces/User";
import DashboardHeader from "./dashboard-header";

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
