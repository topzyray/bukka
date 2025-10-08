type SubMenuItem = { title: string; url: string; icon?: string };

export type TDashboardNavigation = {
  title: string;
  url?: string;
  icon: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}[];
