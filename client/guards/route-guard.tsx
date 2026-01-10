"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RouteHelper } from "@/helpers";
import { UserRole } from "@/data/interfaces/Auth";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/data/interfaces/User";
import { CircularLoader } from "@/components/loaders/circular-loader";

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
  const { user, isLoading, isAuthenticated, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const roleFromPath = useMemo(() => {
    const matched = pathname.match(/\/(dashboard|onboarding)\/([^/]+)/);
    return (matched?.[2]?.toLowerCase() ?? undefined) as UserRole | undefined;
  }, [pathname]);

  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    // Wait until we know whether current user is loaded
    if (isLoading && status === "bootstrapping") return;

    // Unauthenticated users on protected routes → redirect
    if (status === "unauthenticated" && isProtected) {
      router.replace("/signin");
      return;
    }

    // If the route is PUBLIC (isProtected === false)
    // and user is authenticated, route them to their dashboard.
    if (!isProtected && isAuthenticated && user) {
      const target = RouteHelper.getDashboardPath(user);
      // only redirect if not already within dashboard of the same role
      if (!pathname.startsWith("/dashboard") || pathname !== target) {
        router.replace(target);
      }
      return;
    }

    // For protected routes:
    if (isProtected) {
      // Not authenticated → force signin
      if (!isAuthenticated) {
        router.replace("/signin");
        return;
      }

      // Ensure we have a user object (should if isAuthenticated)
      if (!user) {
        // Defensive: revalidate current user query or sign out
        router.replace("/signin");
        return;
      }

      // If user has not completed onboarding, they must be on their onboarding path
      if (user?.isOnboarded === false) {
        const onboardingPath = `/onboarding/${user?.role.toLowerCase()}`;
        if (!pathname.startsWith(onboardingPath)) {
          router.replace(onboardingPath);
        }
        return;
      }

      // If user has completed onboarding, they must NOT be on any /onboarding/* page
      if (user?.isOnboarded === true && pathname.startsWith("/onboarding")) {
        const target = RouteHelper.getDashboardPath(user);
        router.replace(target);
        return;
      }

      // Enforce role-based path isolation when path includes role segment
      if (roleFromPath && userRole && roleFromPath !== userRole) {
        // Role mismatch — take user to their dashboard
        const target = RouteHelper.getDashboardPath(user as User);
        router.replace(target);
        return;
      }

      // If explicit roles were passed to RouteGuard (component-level),
      // ensure user role is included.
      if (roles.length > 0) {
        const normalizedAllowed = roles.map((r) => String(r).toLowerCase());
        if (!normalizedAllowed.includes(userRole ?? "")) {
          const target = RouteHelper.getDashboardPath(user as User);
          router.replace(target);
          return;
        }
      }
    }
  }, [
    status,
    isLoading,
    isAuthenticated,
    user,
    pathname,
    roleFromPath,
    userRole,
    isProtected,
    roles,
    router,
  ]);

  // if (isLoading) {
  //   return null;
  // }
  if (isLoading || status === "bootstrapping") {
    // Instead of returning null, render a minimal loader so we don't show a blank page
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularLoader text="Verifying session..." />
      </div>
    );
  }

  return <>{children}</>;
}
