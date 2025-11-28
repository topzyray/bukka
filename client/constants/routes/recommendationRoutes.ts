import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "@/helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IRecommendationApi =
  | "createRecommendation"
  | "getRecommendations"
  | "getRecommendationById"
  | "getLoggedInUserRecommendations"
  | "approveRecommendation"
  | "rejectRecommendation"
  | "deleteRecommendation";

const rawRecommendationRoutes: Record<IRecommendationApi, string> = {
  createRecommendation: "/recommendations",
  getRecommendations: "/recommendations",
  getRecommendationById: "/recommendations",
  getLoggedInUserRecommendations: "/recommendations/my-recommendations",
  approveRecommendation: "/recommendations",
  rejectRecommendation: "/recommendations",
  deleteRecommendation: "/recommendations",
};

export const recommendationRoutes: Record<IRecommendationApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawRecommendationRoutes);
