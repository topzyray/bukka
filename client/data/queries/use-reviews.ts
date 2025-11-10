import { Review } from "../interfaces/Review";
import { ReviewApiService } from "../services";
import { BukkaResponse, PagedResponse, useCustomQuery } from "./base";

export const useBusinessReviews = ({ businessId }: { businessId: number }) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Review[]>>>(
    ["business-reviews"],
    () => ReviewApiService.getReviewByBusinessId(businessId),
    { enabled: !!businessId }
  );
};

export const useUserReviews = ({ businessId }: { businessId: number }) => {
  return useCustomQuery<BukkaResponse<PagedResponse<Review[]>>>(
    ["user-reviews"],
    () => ReviewApiService.getReviewByBusinessId(businessId),
    { enabled: !!businessId }
  );
};
