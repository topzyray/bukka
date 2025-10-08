"use client";

import { useAuth } from "@/providers/auth-provider";
import { RouteGuard } from "./route-guard";
import { UserRole } from "@/server/interfaces/Auth";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { userDetails } = useAuth();
  return (
    <RouteGuard
      isProtected={true}
      roles={[userDetails?.role.toLowerCase() as UserRole]}
    >
      {children}
    </RouteGuard>
  );
}
