type SubMenuItem = { title: string; url: string; icon?: string };

export type TDashboardNavigation = {
  title: string;
  url?: string;
  icon: string;
  isSidebarNav: boolean;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}[];

export type CookieCategory = {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  defaultEnabled?: boolean;
};

export type CookieConsentState = {
  version: string;
  timestamp: number;
  preferences: Record<string, boolean>;
  acceptedAll?: boolean;
};
