import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';

export class RoutePermissions {
  static CanAccessBaseRoutes(routeUrl: string): boolean {
    if (BaseApiRoutesConstant.BaseApiRoutesMapInvert[routeUrl]) {
      return true;
    }
    return false;
  }
}
