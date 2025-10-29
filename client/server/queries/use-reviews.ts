import { ReviewApiService } from "../services";
import { useCustomQuery } from "./base";

export const useReviews = ({ businessId }: { businessId: number }) => {
  return useCustomQuery(
    ["favorites"],
    () => ReviewApiService.getReviewByBusinessId(businessId),
    { enabled: !!businessId }
  );
};
