import { cookies } from "next/headers";
import { RoleBasedDashboardLayoutClient } from "./role-dashboard-client-layout";

export default async function RoleBasedDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";

  return (
    <RoleBasedDashboardLayoutClient params={params} defaultOpen={defaultOpen}>
      {children}
    </RoleBasedDashboardLayoutClient>
  );
}
