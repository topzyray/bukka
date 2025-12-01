import { Injectable } from '@nestjs/common';
import { ProcessNewReviewDto } from 'src/DomainLayer/Dtos/ReviewNotifictaionHelperDto';
import { ReviewNotificationService } from '../Services/notification/services/ReviewNotificationService';

@Injectable()
export class ReviewNotificationHelper {
  constructor(private readonly svc: ReviewNotificationService) {}

  async processNewReview(data: ProcessNewReviewDto, category: string) {
    await this.svc.processNewReview(data, category);
  }
}
