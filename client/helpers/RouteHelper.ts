import { User } from "@/server/interfaces/User";

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
    if (!user) return "/login";

    if (!user.isUpdated) {
      return `/dashboard/${user?.role.toLowerCase()}/onboarding`;
    }

    return `/dashboard/${user.role}/overview`;
  }
}
