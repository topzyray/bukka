import { BackendUrlEnum } from "@/server/enums";
import { RouteHelper } from "../../helpers";

const BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IReviewApi =
  | "addReview"
  | "getReviewById"
  | "updateReview"
  | "deleteReview"
  | "getReviewByBusinessId";

const rawReviewRoutes: Record<IReviewApi, string> = {
  addReview: "/reviews",
  getReviewById: "/reviews",
  updateReview: "/reviews",
  deleteReview: "/reviews",
  getReviewByBusinessId: "/reviews/business",
};

export const reviewRoutes: Record<IReviewApi, string> =
  RouteHelper.createRoutes(BACKEND_SVC_PATH, rawReviewRoutes);
