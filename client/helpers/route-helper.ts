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

  static getDashboardPath<T extends User>(user: T): string {
    if (!user) return "/signin";

    const role = user?.role;
    if (!role) return "/signin";

    if (!user.isOnboarded) return `/onboarding/${role?.toLowerCase()}`;

    switch (role) {
      case UserRoleEnum.ADMIN:
        return `/dashboard/admin/overview`;
      case UserRoleEnum.VENDOR:
        return `/dashboard/vendor/overview`;
      case UserRoleEnum.INVESTOR:
        return `/dashboard/investor/overview`;
      case UserRoleEnum.RIDER:
        return `/dashboard/rider/overview`;
      case UserRoleEnum.USER:
        return `/dashboard/user/overview`;
      default:
        throw new Error("Invalid role!");
    }
  }
}
