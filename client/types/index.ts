type SubMenuItem = { title: string; url: string; icon?: string };

export type TDashboardNavigation = {
  title: string;
  url?: string;
  icon: string;
  isSidebarNav: boolean;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}[];
