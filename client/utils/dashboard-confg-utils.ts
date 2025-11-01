import { UserRoleEnum } from "@/data/enums";
import { DashboardTitleEnum } from "@/data/enums";
import {
  ADMIN,
  INVESTOR,
  RIDER,
  USER,
  VENDOR,
} from "@/constants/dashboard-navigations";

export function getDashboardConfig(role: UserRoleEnum) {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return {
        title: DashboardTitleEnum.ADMIN,
        navItems: ADMIN,
      };
    case UserRoleEnum.USER:
      return {
        title: DashboardTitleEnum.USER,
        navItems: USER,
      };
    case UserRoleEnum.VENDOR:
      return {
        title: DashboardTitleEnum.VENDOR,
        navItems: VENDOR,
      };
    case UserRoleEnum.RIDER:
      return {
        title: DashboardTitleEnum.RIDER,
        navItems: RIDER,
      };
    case UserRoleEnum.INVESTOR:
      return {
        title: DashboardTitleEnum.INVESTOR,
        navItems: INVESTOR,
      };
    default:
      return {
        title: DashboardTitleEnum.DEFAULT,
        navItems: [],
      };
  }
}
