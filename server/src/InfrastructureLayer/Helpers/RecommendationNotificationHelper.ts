import { Injectable } from '@nestjs/common';
import { RecommendationNotificationService } from '../Services/notification/services/RecommendationNotificationService';
import {
  ProcessNewRecommendationDto,
  ProcessRecommendationApprovalDto,
  ProcessRecommendationDeletionDto,
  ProcessRecommendationRejectionDto,
} from 'src/DomainLayer/Dtos/RecommendationNotifictaionHelperDto';

@Injectable()
export class RecommendationNotificationHelper {
  constructor(private readonly service: RecommendationNotificationService) {}

  async processNewRecommendation(
    data: ProcessNewRecommendationDto,
    category: string,
  ) {
    await this.service.processNewRecommendation(data, category);
  }

  async processApproval(
    data: ProcessRecommendationApprovalDto,
    category: string,
  ) {
    await this.service.processRecommendationApproval(data, category);
  }

  async processRejection(
    data: ProcessRecommendationRejectionDto,
    category: string,
  ) {
    await this.service.processRecommendationRejection(data, category);
  }

  async processDeletion(
    data: ProcessRecommendationDeletionDto,
    category: string,
  ) {
    await this.service.processRecommendationDeletion(data, category);
  }
}
