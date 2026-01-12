import { UserRoleEnum } from "@/data/enums";
import { User } from "@/data/interfaces/User";

export class RouteHelper {
  static createRoutes(
    basePath: string,
    routes: Record<string, string>
  ): Record<string, string> {
    const prefixedRoutes: Record<string, string> = {};
    for (const key in routes) {
      prefixedRoutes[key] = `${basePath}${routes[key]}`;
    }
    return prefixedRoutes;
  }

  static buildRoute(route: string, param?: string): string {
    return param ? `${route}/${param}` : route;
  }

  /**
   * 🔐 Centralized post-auth redirect
   * Used by:
   * - RouteGuard
   * - AuthProvider
   * - Login success handler
   */
  static getPostAuthPath(user?: User | null): string {
    if (!user?.role) return "/signin";

    if (!user.isOnboarded) {
      return `/onboarding/${user.role.toLowerCase()}`;
    }

    return this.getDashboardPath(user);
  }

  /**
   * 📊 Dashboard root resolver
   * Always returns a valid path
   */
  static getDashboardPath(user?: User | null): string {
    if (!user?.role) return "/signin";

    // switch (user.role) {
    //   case UserRoleEnum.ADMIN:
    //     return `/dashboard/admin/overview`;
    //   case UserRoleEnum.VENDOR:
    //     return `/dashboard/vendor/overview`;
    //   case UserRoleEnum.INVESTOR:
    //     return `/dashboard/investor/overview`;
    //   case UserRoleEnum.RIDER:
    //     return `/dashboard/rider/overview`;
    //   case UserRoleEnum.USER:
    //     return `/dashboard/user/overview`;
    //   default:
    //     throw new Error("Invalid role!");
    // }

    return user?.role
      ? `/dashboard/${user?.role?.toLowerCase()}/overview`
      : "/signin";
  }
  /**
   * 🏢 Business details routing
   * Context-aware (dashboard vs public)
   */
  static businessDetailsLink(
    pathname: string,
    userRole: UserRoleEnum | string | undefined,
    businessId?: number
  ): string {
    if (!businessId) return "#";

    const isDashboard = pathname.startsWith("/dashboard");
    const idSegment = `/${businessId}`;

    if (!isDashboard) {
      return `/businesses${idSegment}`;
    }

    switch (userRole) {
      case UserRoleEnum.USER:
        return `/dashboard/user/favourites${idSegment}`;
      case UserRoleEnum.ADMIN:
      case UserRoleEnum.VENDOR:
      case UserRoleEnum.INVESTOR:
        return `/dashboard/${userRole.toLowerCase()}/businesses${idSegment}`;
      default:
        return `/businesses${idSegment}`;
    }
  }

  /**
   * 🧭 Role extracted from URL
   * Used by RouteGuard
   */
  static extractRoleFromPath(pathname: string): UserRoleEnum | undefined {
    const match = pathname.match(/\/(dashboard|onboarding)\/([^/]+)/);
    return match?.[2]?.toUpperCase() as UserRoleEnum | undefined;
  }
}
