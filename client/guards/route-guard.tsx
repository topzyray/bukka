"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RouteHelper } from "@/helpers/RouteHelper";
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
  const { userDetails, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const needsOnboarding = userDetails?.isUpdated === false;

  useEffect(() => {
    if (loading) return;

    // Infer role from pathname for automatic restriction
    const roleFromPath = pathname
      .match(/\/(dashboard|onboarding)\/([^/]+)/)?.[2]
      ?.toLowerCase() as UserRole | undefined;

    const userRole = userDetails?.role?.toLowerCase();

    if (isProtected) {
      if (!userDetails && pathname !== "/signin") {
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
        const target = RouteHelper.getDashboardPath(userDetails as User);
        if (pathname !== target) router.replace(target);
        return;
      }
    }

    if (!isProtected && userDetails) {
      const target = RouteHelper.getDashboardPath(userDetails);
      if (pathname !== target) router.replace(target);
    }
  }, [
    roles,
    router,
    loading,
    pathname,
    userDetails,
    isProtected,
    needsOnboarding,
  ]);

  if (loading || (isProtected && !userDetails)) {
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
//   const { userDetails, loading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const needsOnboarding = userDetails?.isUpdated === false;

//   useEffect(() => {
//     if (loading) return;

//     if (isProtected) {
//       if (!userDetails && pathname !== "/signin") {
//         router.replace("/signin");
//         return;
//       }

//       if (
//         needsOnboarding &&
//         pathname !== `/onboarding/${userDetails?.role.toLowerCase()}`
//       ) {
//         router.push(`/onboarding/${userDetails?.role.toLowerCase()}`);
//         return;
//       }

//       if (
//         roles.length > 0 &&
//         userDetails &&
//         !roles.includes(userDetails.role)
//       ) {
//         const target = RouteHelper.getDashboardPath(userDetails);
//         if (pathname !== target) router.replace(target);
//         return;
//       }
//     }

//     if (!isProtected && userDetails) {
//       const target = RouteHelper.getDashboardPath(userDetails);
//       if (pathname !== target) router.replace(target);
//     }
//   }, [
//     roles,
//     router,
//     loading,
//     pathname,
//     userDetails,
//     isProtected,
//     needsOnboarding,
//   ]);

//   if (loading || (isProtected && !userDetails)) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <CircularLoader text="Loading..." />
//       </div>
//     );
//   }

//   return children;
// }
