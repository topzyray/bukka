import DashboardLayout from "@/components/global/dashboard-layout";
import { cookies } from "next/headers";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";
  return (
    <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>
  );
}
