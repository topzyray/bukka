export type CreateReviewDto = {
  userId: number;
  businessId: number;
  rating: number;
  comment?: string;
};

export type UpdateReviewDto = {
  userId: number;
  businessId: number;
  rating: number;
  comment?: string;
};
