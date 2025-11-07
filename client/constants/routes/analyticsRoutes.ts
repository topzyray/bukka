import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IAnalyticsApi = "adminOverview" | "userActivitySummary";

const rawAnalyticsRoutes: Record<IAnalyticsApi, string> = {
  adminOverview: "/analytics/admin/overview",
  userActivitySummary: "/analytics/users/activities/summary",
};

export const analyticsRoutes: Record<IAnalyticsApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawAnalyticsRoutes);
