import { BackendUrlEnum } from "@/data/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IReviewApi =
  | "addReview"
  | "getReviewById"
  | "updateReview"
  | "deleteReview"
  | "getReviews";

const rawReviewRoutes: Record<IReviewApi, string> = {
  addReview: "/reviews",
  getReviewById: "/reviews",
  updateReview: "/reviews",
  deleteReview: "/reviews",
  getReviews: "/reviews",
};

export const reviewRoutes: Record<IReviewApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawReviewRoutes);
