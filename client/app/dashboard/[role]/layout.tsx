import { cookies } from "next/headers";
import { RoleBasedDashboardLayoutClient } from "./role-dashboard-client-layout";

export default async function RoleBasedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";

  return (
    <RoleBasedDashboardLayoutClient defaultOpen={defaultOpen}>
      {children}
    </RoleBasedDashboardLayoutClient>
  );
}
