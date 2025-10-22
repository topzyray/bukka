import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewDataAgent } from 'src/DataLayer/DataAgents/ReviewDataAgent';
import { BusinessDataAgent } from 'src/DataLayer/DataAgents/BusinessDataAgent';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilterDto,
} from 'src/DomainLayer/Dtos/ReviewDto';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';

@Injectable()
export class ReviewRepository {
  constructor(
    private readonly reviewDataAgent: ReviewDataAgent,
    private readonly businessDataAgent: BusinessDataAgent,
  ) {}

  // Create review and incrementally update business aggregated rating
  async createReview(dto: CreateReviewDto) {
    const loggedInUser = await UserHelper.getLoggedInUser();

    // Check business existence
    const business = await this.businessDataAgent.findById(dto.businessId);
    if (!business) throw new NotFoundException('Business not found');

    // Ensure one review per user per business
    const existing = await this.reviewDataAgent.findByUserAndBusiness(
      loggedInUser.id,
      dto.businessId,
    );
    if (existing)
      throw new BadRequestException('You have already reviewed this business');

    // Create review
    const review = await this.reviewDataAgent.createReview({
      userId: loggedInUser.id,
      businessId: dto.businessId,
      rating: dto.rating,
      comment: dto.comment,
    } as any);

    // Update business aggregates (simple incremental calculation)
    const prevAvg = business.averageRating ?? 0;
    const prevCount = business.reviewCount ?? 0;
    const newCount = prevCount + 1;
    const newAvg = (prevAvg * prevCount + dto.rating) / newCount;

    await this.businessDataAgent.updateBusiness(dto.businessId, {
      averageRating: Number(newAvg.toFixed(2)),
      reviewCount: newCount,
    } as any);

    return BukkaResponse.CreateResponse('Review', review);
  }

  async getReviewById(id: number) {
    const review = await this.reviewDataAgent.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return BukkaResponse.GetSingleDataResponse('Review', review);
  }

  async listReviewsByBusiness(businessId: number, filterDto: ReviewFilterDto) {
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return await this.reviewDataAgent.findByBusinessId(
      businessId,
      pageSize,
      pageNumber,
    );
  }

  async updateReview(id: number, dto: UpdateReviewDto) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const existing = await this.reviewDataAgent.findById(id);
    if (!existing) throw new NotFoundException('Review not found');
    if (existing.userId !== loggedInUser.id)
      throw new ForbiddenException('Unauthorized');

    // If rating changes, update business aggregates accordingly
    const oldRating = existing.rating;
    const updated = await this.reviewDataAgent.updateReview(id, dto as any);

    if (dto.rating && dto.rating !== oldRating) {
      const business = await this.businessDataAgent.findById(
        existing.businessId,
      );
      if (business) {
        const prevAvg = business.averageRating ?? 0;
        const prevCount = business.reviewCount ?? 1;
        // recompute average: (prevAvg*prevCount - oldRating + newRating)/prevCount
        const newAvg =
          (prevAvg * prevCount - oldRating + dto.rating) / prevCount;
        await this.businessDataAgent.updateBusiness(existing.businessId, {
          averageRating: Number(newAvg.toFixed(2)),
        } as any);
      }
    }

    return BukkaResponse.UpdateResponse('Review', updated);
  }

  async deleteReview(id: number) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const existing = await this.reviewDataAgent.findById(id);
    if (!existing) throw new NotFoundException('Review not found');
    if (existing.userId !== loggedInUser.id)
      throw new ForbiddenException('Unauthorized');

    await this.reviewDataAgent.deleteReview(id);

    // Update business aggregates: decrement count and recompute average (safe fallback: if count becomes 0 set avg to 0)
    const business = await this.businessDataAgent.findById(existing.businessId);
    if (business) {
      const prevAvg = business.averageRating ?? 0;
      const prevCount = business.reviewCount ?? 1;
      const newCount = Math.max(0, prevCount - 1);
      let newAvg = 0;
      if (newCount === 0) newAvg = 0;
      else {
        // approximate: (prevAvg * prevCount - oldRating) / newCount
        newAvg = (prevAvg * prevCount - existing.rating) / newCount;
      }
      await this.businessDataAgent.updateBusiness(existing.businessId, {
        averageRating: Number(newAvg.toFixed(2)),
        reviewCount: newCount,
      } as any);
    }

    return BukkaResponse.DeleteResponse('Review', true);
  }
}
