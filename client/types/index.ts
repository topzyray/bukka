export type DashboardTitleType =
  | "Admin"
  | "User"
  | "Restaurant"
  | "Dispatch Rider";

type SubMenuItem = { title: string; url: string; icon?: string };

export type NavItems = {
  title: string;
  url?: string;
  icon: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}[];
