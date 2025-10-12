import { RouteGuard } from "./route-guard";
import { UserRole } from "@/server/interfaces/Auth";

export function OnboardingGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  return (
    <RouteGuard isProtected={true} roles={roles}>
      {children}
    </RouteGuard>
  );
}
