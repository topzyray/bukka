export class ProcessNewRecommendationDto {
  userId: number;
  recommenderId: number;
  recommenderEmail: string;
  recommenderName: string;
  businessName: string;
  recommendationId: number;
}

export class ProcessRecommendationApprovalDto {
  userId: number;
  recommenderId: number;
  recommenderEmail: string;
  recommenderName: string;
  businessName: string;
  recommendationId: number;
}

export class ProcessRecommendationRejectionDto {
  userId: number;
  recommenderId: number;
  recommenderEmail: string;
  recommenderName: string;
  businessName: string;
  recommendationId: number;
}

export class ProcessRecommendationDeletionDto {
  userId: number;
  recommenderId: number;
  recommenderEmail: string;
  recommenderName: string;
  businessName: string;
  recommendationId: number;
}
