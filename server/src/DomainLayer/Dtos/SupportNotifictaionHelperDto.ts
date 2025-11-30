import { RecommendationStatusEnum } from '../Enums/RecommendationStatuEnum';

export class ProcessSupportCreatedDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  ticketId: string;
  supportId: number;
  creatorId: number;
  creatorEmail: string;
  title: string;
  description: string;
  status: RecommendationStatusEnum;
  assigneeId: number;
}
