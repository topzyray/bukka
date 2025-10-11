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
    if (!isProtected && isAuthenticated && user) {
      const target = RouteHelper.getDashboardPath(user);
      if (pathname !== target) router.replace(target);
      return;
    }

    if (isProtected) {
      if (!isAuthenticated) {
        console.log("I GOT HERE");

        router.replace("/signin");
        return;
      }

      if (user && user?.isUpdated === false) {
        const onboardingPath = RouteHelper.getDashboardPath(user);

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

      console.log("ROUTE GUARD: ALLOWED ROLES: ", allowedRoles);

      if (allowedRoles.length > 0 && user && !allowedRoles.includes(userRole)) {
        const target = RouteHelper.getDashboardPath(user as User);
        console.log("ROUTE GUARD: TARGET: ", target);
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

  return <>{children}</>;
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
