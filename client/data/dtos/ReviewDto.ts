export type CreateReviewDto = {
  userId: number;
  businessId: number;
  rating: number;
  comment?: string;
};

export type UpdateReviewDto = {
  reviewId: number;
  userId: number;
  businessId: number;
  rating?: number;
  comment?: string;
};
