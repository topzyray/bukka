import { ReviewApiService } from "../services";
import { useCustomQuery } from "./base";

export const useBusinessReviews = ({ businessId }: { businessId: number }) => {
  return useCustomQuery(
    ["business-reviews"],
    () => ReviewApiService.getReviewByBusinessId(businessId),
    { enabled: !!businessId }
  );
};

export const useUserReviews = ({ businessId }: { businessId: number }) => {
  return useCustomQuery(
    ["user-reviews"],
    () => ReviewApiService.getReviewByBusinessId(businessId),
    { enabled: !!businessId }
  );
};
