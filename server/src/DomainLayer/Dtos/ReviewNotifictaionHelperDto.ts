import { UserRoleEnum } from '../Enums/UserRoleEnum';

export class ProcessNewReviewDto {
  reviewerId: number;
  reviewerFirstName: string;
  reviewerLastName: string;
  reviewerEmail: string;
  vendorId: number;
  vendorEmail: string;
  role: UserRoleEnum;
  userReviewLink: string;
  businessReviewedLink: string;
  businessName: string;
  rating: string;
  comment: string;
}
