"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RouteHelper } from "@/helpers";
import { UserRole } from "@/server/interfaces/Auth";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/server/interfaces/User";

interface RouteGuardProps {
  children: ReactNode;
  isProtected: boolean;
  roles?: UserRole[];
}

export function RouteGuard({
  children,
  isProtected = false,
  roles = [],
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const roleFromPath = pathname
    .match(/\/(dashboard|onboarding)\/([^/]+)/)?.[2]
    ?.toLowerCase() as UserRole | undefined;

  const userRole = user?.role?.toLowerCase() as string;

  useEffect(() => {
    // if (isLoading) return;

    if (!isProtected && isAuthenticated && user) {
      const target = RouteHelper.getDashboardPath(user);
      if (pathname !== target && !pathname.startsWith("/dashboard")) {
        router.replace(target);
      }
      return;
    }

    if (isProtected) {
      if (!isAuthenticated) {
        router.replace("/signin");
        return;
      }

      if (user && user?.isUpdated === false) {
        const onboardingPath = `/onboarding/${user.role.toLowerCase()}`;
        if (!pathname.startsWith(onboardingPath)) {
          router.replace(onboardingPath);
        }
      }

      const allowedRoles =
        roles.length > 0
          ? roles.map((r) => r.toLowerCase())
          : roleFromPath
          ? [roleFromPath]
          : [];

      if (allowedRoles.length > 0 && user && !allowedRoles.includes(userRole)) {
        const target = RouteHelper.getDashboardPath(user as User);
        if (pathname !== target) router.replace(target);
        return;
      }
    }
  }, [
    roles,
    router,
    isLoading,
    pathname,
    user,
    isProtected,
    isAuthenticated,
    roleFromPath,
    userRole,
  ]);

  // if (isLoading) return null; // prevents flashing during rehydration

  return <>{children}</>;
}
