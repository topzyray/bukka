import {
  ADMIN,
  VENDOR,
  USER,
  RIDER,
  INVESTOR,
} from "@/constants/dashboard-navigations";
import { UserRoleEnum } from "@/server/enums";

export function getAllowedRoutesForRole(role: UserRoleEnum): string[] {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return ADMIN.map((item) => item.url as string);
    case UserRoleEnum.VENDOR:
      return VENDOR.map((item) => item.url as string);
    case UserRoleEnum.USER:
      return USER.map((item) => item.url as string);
    case UserRoleEnum.RIDER:
      return RIDER.map((item) => item.url as string);
    case UserRoleEnum.INVESTOR:
      return INVESTOR.map((item) => item.url as string);
    default:
      return [];
  }
}
