"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RouteHelper } from "@/helpers";
import { UserRole } from "@/data/interfaces/Auth";
import { useAuth } from "@/providers/auth-provider";
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
}: Readonly<RouteGuardProps>) {
  const { user, isLoading, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const roleFromPath = RouteHelper.extractRoleFromPath(pathname);
  const userRole = user?.role?.toLowerCase();

  const redirectingRef = useRef(false);

  useEffect(() => {
    if (redirectingRef.current) return; // already redirecting

    // Never redirect during bootstrap
    if (status === "bootstrapping") return;

    // Unauthenticated users on protected routes → redirect
    if (isProtected && (!user || status === "unauthenticated")) {
      redirectingRef.current = true;
      router.replace("/signin");
      return;
    }

    // Public auth pages → redirect authenticated users
    const authPages = [
      "/signin",
      "/signup",
      "/forgot-password",
      "/confirm-email",
      "/request-email-verification",
      "/reset-password",
    ];

    if (
      !isProtected &&
      status === "authenticated" &&
      user &&
      authPages.includes(pathname)
    ) {
      redirectingRef.current = true;
      router.replace(RouteHelper.getPostAuthPath(user));
      return;
    }

    if (!isProtected || !user) return;

    const expectedPath = RouteHelper.getPostAuthPath(user);

    // Enforce onboarding/dashboard correctness
    if (!pathname.startsWith(expectedPath.split("/").slice(0, 3).join("/"))) {
      redirectingRef.current = true;
      router.replace(expectedPath);
      return;
    }

    // Role isolation (URL role ≠ user role)
    if (roleFromPath && roleFromPath.toLowerCase() !== userRole) {
      redirectingRef.current = true;
      router.replace(expectedPath);
      return;
    }

    // Component-level role enforcement
    if (roles.length > 0) {
      const allowed = roles.map((r) => r.toLowerCase());
      if (!allowed.includes(userRole ?? "")) {
        redirectingRef.current = true;
        router.replace(expectedPath);
      }
    }
  }, [
    status,
    user,
    pathname,
    roleFromPath,
    userRole,
    isProtected,
    roles,
    router,
  ]);

  if ((isLoading || status === "bootstrapping") && isProtected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularLoader text="Verifying session..." />
      </div>
    );
  }

  return <>{children}</>;
}
