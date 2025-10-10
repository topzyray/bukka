"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RouteHelper } from "@/helpers";
import { CircularLoader } from "@/components/loaders/circular-loader";
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
  isProtected,
  roles = [],
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const needsOnboarding = isAuthenticated && user?.isUpdated === false;

  useEffect(() => {
    if (isLoading) return;

    // Infer role from pathname for automatic restriction
    const roleFromPath = pathname
      .match(/\/(dashboard|onboarding)\/([^/]+)/)?.[2]
      ?.toLowerCase() as UserRole | undefined;

    const userRole = user?.role?.toLowerCase();

    if (isProtected) {
      if (!user && !isAuthenticated) {
        router.replace("/signin");
        return;
      }

      if (needsOnboarding && pathname !== `/onboarding/${userRole}`) {
        router.replace(`/onboarding/${userRole}`);
        return;
      }

      const allowedRoles =
        roles.length > 0
          ? roles.map((r) => r.toLowerCase())
          : roleFromPath
          ? [roleFromPath]
          : [];

      if (
        allowedRoles.length > 0 &&
        userRole &&
        !allowedRoles.includes(userRole)
      ) {
        const target = RouteHelper.getDashboardPath(user as User);
        if (pathname !== target) router.replace(target);
        return;
      }
    }

    if (!isProtected && isAuthenticated && user) {
      const target = RouteHelper.getDashboardPath(user);
      if (pathname !== target) router.replace(target);
      return;
    }
  }, [
    roles,
    router,
    isLoading,
    pathname,
    user,
    isProtected,
    needsOnboarding,
    isAuthenticated,
  ]);

  if (isLoading || (isProtected && !user)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CircularLoader text="Loading..." />
      </div>
    );
  }

  return children;
}

// "use client";

// import { ReactNode, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { RouteHelper } from "@/helpers/RouteHelper";
// import { CircularLoader } from "@/components/loaders/circular-loader";
// import { UserRole } from "@/server/interfaces/Auth";
// import { useAuth } from "@/providers/auth-provider";

// interface RouteGuardProps {
//   children: ReactNode;
//   isProtected: boolean;
//   roles?: UserRole[];
// }

// export function RouteGuard({
//   children,
//   isProtected,
//   roles = [],
// }: RouteGuardProps) {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const needsOnboarding = user?.isUpdated === false;

//   useEffect(() => {
//     if (isLoading) return;

//     if (isProtected) {
//       if (!user && pathname !== "/signin") {
//         router.replace("/signin");
//         return;
//       }

//       if (
//         needsOnboarding &&
//         pathname !== `/onboarding/${user?.role.toLowerCase()}`
//       ) {
//         router.push(`/onboarding/${user?.role.toLowerCase()}`);
//         return;
//       }

//       if (
//         roles.length > 0 &&
//         user &&
//         !roles.includes(user.role)
//       ) {
//         const target = RouteHelper.getDashboardPath(user);
//         if (pathname !== target) router.replace(target);
//         return;
//       }
//     }

//     if (!isProtected && user) {
//       const target = RouteHelper.getDashboardPath(user);
//       if (pathname !== target) router.replace(target);
//     }
//   }, [
//     roles,
//     router,
//     isLoading,
//     pathname,
//     user,
//     isProtected,
//     needsOnboarding,
//   ]);

//   if (isLoading || (isProtected && !user)) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <CircularLoader text="Loading..." />
//       </div>
//     );
//   }

//   return children;
// }
