export interface UserActivitiesSummary {
  businesses: number;
  favorites: number;
  files: number;
  reviews: number;
  sessions: number;
}

export interface AdminOverview {
  stats: Array<{
    title: string;
    value: string;
    change?: string;
    positive?: boolean;
    icon?: string; // optional icon name for frontend if needed
  }>;
  userGrowthData: Array<{ month: string; users: number }>;
  businessCategoryData: Array<{ name: string; value: number; color?: string }>;
  orderData: Array<{ day: string; orders: number }>;
  recentActivity: Array<{ action: string; user: string; time: string }>;
  others: Record<string, any>;
}
