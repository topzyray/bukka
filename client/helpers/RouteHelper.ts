import { User } from "../../types";

export class RouteHelper {
  static createRoutes(basePath: string, routes: Record<string, string>): Record<string, string> {
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

    if (user.role === "student" && !user.is_updated) {
      return "/dashboard/student/onboarding";
    }

    return `/dashboard/${user.role}/overview`;
  }
}
