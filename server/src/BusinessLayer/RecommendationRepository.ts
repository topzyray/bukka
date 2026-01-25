import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { LocationDataAgent } from 'src/DataLayer/DataAgents/LocationDataAgent';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { LocationCoordsHelper } from 'src/InfrastructureLayer/Helpers/LocationCoordsHelper';
import { RecommendationDataAgent } from 'src/DataLayer/DataAgents/RecommendationDataAgent';
import {
  CreateRecommendationDto,
  FilterRecommendationDto,
} from 'src/DomainLayer/Dtos/RecommendationDto';
import { Recommendation } from 'src/DomainLayer/Models/Recommendation';
import { RecommendationStatusEnum } from 'src/DomainLayer/Enums/RecommendationStatuEnum';
import { BusinessDataAgent } from 'src/DataLayer/DataAgents/BusinessDataAgent';
import { Business } from 'src/DomainLayer/Models/Business';
import { QueueService } from 'src/InfrastructureLayer/Services/queue/QueueService';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import { RecommendationQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/RecommendationQueueMessageTypeEnum';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';

const TOLERANCE = 1e-5;

@Injectable()
export class RecommendationRepository {
  constructor(
    private readonly recommendationDataAgent: RecommendationDataAgent,
    private readonly businessDataAgent: BusinessDataAgent,
    private readonly locationDataAgent: LocationDataAgent,
    private readonly _queue: QueueService,
  ) {}

  async createRecommendation(
    dto: CreateRecommendationDto,
  ): Promise<BukkaResponse<Recommendation>> {
    const {
      longitude,
      latitude,
      address,
      city,
      state,
      country,
      zipCode,
      ...otherDto
    } = dto;

    let location = await this.locationDataAgent.findNearbyLocation(
      longitude,
      latitude,
      TOLERANCE,
    );

    if (
      !location ||
      LocationCoordsHelper.coordsDiffer(
        { lat: latitude, lng: longitude },
        { lat: location.latitude, lng: location.longitude },
        TOLERANCE,
      )
    ) {
      const newLocationData = {
        longitude,
        latitude,
        // TODO: ADD THE FOLLOWING WHEN YOU IMPLEMENT GEOCODING
        address,
        city,
        state,
        country,
        // placeId,
      };

      location = await this.locationDataAgent.createLocation(newLocationData);
    }

    const loggedInUser = await UserHelper.getLoggedInUser();

    const existingRecommendation =
      await this.recommendationDataAgent.findByLocation(location?.id as number);

    if (existingRecommendation) {
      return BukkaResponse.CustomResponse(
        'Recommendation already exists.',
        HttpStatus.OK,
        true,
        existingRecommendation,
      );
    }

    const recommendation =
      await this.recommendationDataAgent.createRecommendation({
        ...otherDto,
        locationId: location?.id,
        recommenderId: loggedInUser.id,
        status: RecommendationStatusEnum.PENDING,
      });

    this._queue.publishToQueue(
      QueueEnum.RECOMMENDATION_NOTIFICATION,
      {
        messageType: RecommendationQueueMessageTypeEnum.RECOMMENDATION_CREATED,
        payload: {
          recommenderId: loggedInUser?.id,
          recommenderEmail: loggedInUser?.email,
          recommenderName: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
          recommendationId: recommendation?.id,
          businessName: recommendation?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('recommendations', {});
    await invalidateCache('my-recommendations', {});

    return BukkaResponse.CustomResponse(
      'Thanks for your recommendation!',
      HttpStatus.CREATED,
      true,
      recommendation,
    );
  }

  async getRecommendationById(
    id: number,
  ): Promise<BukkaResponse<Recommendation>> {
    return handleCache(
      'recommendation',
      { id },
      async () => {
        const recommendation = await this.recommendationDataAgent.findById(id);
        if (!recommendation)
          throw new NotFoundException('Recommendation not found');
        return BukkaResponse.GetSingleDataResponse(
          'Recommendation',
          recommendation,
        );
      },
      CacheTTLPolicyEnum.RECOMMENDATION_DETAIL,
    );
  }

  async getUserRecommendations(
    filterDto: FilterRecommendationDto,
  ): Promise<PagedData<Recommendation[]>> {
    const { recommenderId, ...otherFilters } = filterDto;
    const loggedInUser = await UserHelper.getLoggedInUser();
    const processedFilter = {
      ...otherFilters,
      recommenderId: loggedInUser?.id,
    };
    const query = FilterQueryHelper.buildQuery({
      dto: processedFilter,
      rules: [
        { field: 'type' },
        { field: 'status' },
        { field: 'recommenderId' },
      ],
      searchConfig: {
        fields: [
          'name',
          'description',
          'note',
          'slug',
          { field: 'cuisines', dtoKey: 'cuisines', defaultOp: 'has' },
        ],
        mode: 'insensitive',
      },
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(processedFilter);
    return handleCache(
      'my-recommendations',
      processedFilter as Record<string, any>,
      () => {
        return this.recommendationDataAgent.findAll(
          query,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.MY_RECOMMENDATION_LIST,
    );
  }

  async getRecommendations(
    filterDto: FilterRecommendationDto,
  ): Promise<PagedData<Recommendation[]>> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [
        { field: 'type' },
        { field: 'status' },
        { field: 'recommenderId' },
      ],
      searchConfig: {
        fields: [
          'name',
          'description',
          'note',
          'slug',
          { field: 'cuisines', dtoKey: 'cuisines', defaultOp: 'has' },
        ],
        mode: 'insensitive',
      },
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return handleCache(
      'recommendations',
      filterDto as Record<string, any>,
      () => {
        return this.recommendationDataAgent.findAll(
          query,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.RECOMMENDATION_LIST,
    );
  }

  async approveRecommendation(id: number): Promise<BukkaResponse<Business>> {
    const recommendation = await this.recommendationDataAgent.findById(id);
    if (!recommendation)
      throw new NotFoundException('Recommendation not found');

    const business = await this.businessDataAgent.createBusiness({
      name: recommendation?.name,
      description: recommendation?.description,
      type: recommendation?.type,
      categoryId: recommendation?.categoryId,
      slug: recommendation?.slug,
      phoneNumber: recommendation?.phoneNumber ?? null,
      email: recommendation?.email ?? null,
      website: recommendation?.website ?? null,
      registrationNo: recommendation?.registrationNo ?? null,
      cuisines: recommendation?.cuisines ?? [],
      locationId: recommendation?.locationId,
      recommenderId: recommendation?.recommenderId,
      isActive: true,
    });

    await this.recommendationDataAgent.updateRecommendation(id, {
      status: RecommendationStatusEnum.APPROVED,
    });

    this._queue.publishToQueue(
      QueueEnum.RECOMMENDATION_NOTIFICATION,
      {
        messageType: RecommendationQueueMessageTypeEnum.RECOMMENDATION_APPROVED,
        payload: {
          recommenderId: recommendation?.recommenderId,
          recommenderEmail: recommendation?.email,
          recommenderName: `${recommendation?.recommender?.firstName} ${recommendation?.recommender?.lastName}`,
          recommendationId: recommendation?.id,
          businessName: recommendation?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('recommendation', { id });
    await invalidateCache('recommendations', {});
    await invalidateCache('my-recommendations', {});
    await invalidateCache('businesses', {});

    return BukkaResponse.CustomResponse(
      'Recommendation approved successfully. Recommendation is now live!',
      HttpStatus.OK,
      true,
      business,
    );
  }

  async rejectRecommendation(id: number) {
    const recommendation = await this.recommendationDataAgent.findById(id);
    if (!recommendation)
      throw new NotFoundException('Recommendation not found');
    const updated = await this.recommendationDataAgent.updateRecommendation(
      id,
      {
        status: RecommendationStatusEnum.REJECTED,
      },
    );

    this._queue.publishToQueue(
      QueueEnum.RECOMMENDATION_NOTIFICATION,
      {
        messageType: RecommendationQueueMessageTypeEnum.RECOMMENDATION_REJECTED,
        payload: {
          recommenderId: recommendation?.recommenderId,
          recommenderEmail: recommendation?.email,
          recommenderName: `${recommendation?.recommender?.firstName} ${recommendation?.recommender?.lastName}`,
          recommendationId: recommendation?.id,
          businessName: recommendation?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('recommendation', { id });
    await invalidateCache('recommendations', {});
    await invalidateCache('my-recommendations', {});
    await invalidateCache('businesses', {});
    return BukkaResponse.CustomResponse(
      'Recommendation reject successfully!',
      HttpStatus.OK,
      true,
      updated,
    );
  }

  async deleteRecommendation(id: number): Promise<BukkaResponse<void>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const recommendation = await this.recommendationDataAgent.findById(id);
    if (!recommendation)
      throw new NotFoundException('Recommendation not found');

    if (
      recommendation.recommenderId !== loggedInUser.id ||
      loggedInUser.role !== UserRoleEnum.ADMIN
    )
      throw new ForbiddenException('Unauthorized delete');

    await this.recommendationDataAgent.deleteRecommendation(id);

    this._queue.publishToQueue(
      QueueEnum.RECOMMENDATION_NOTIFICATION,
      {
        messageType: RecommendationQueueMessageTypeEnum.RECOMMENDATION_DELETED,
        payload: {
          recommenderId: recommendation?.recommenderId,
          recommenderEmail: recommendation?.email,
          recommenderName: `${recommendation?.recommender?.firstName} ${recommendation?.recommender?.lastName}`,
          recommendationId: recommendation?.id,
          businessName: recommendation?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('recommendation', { id });
    await invalidateCache('recommendations', {});
    await invalidateCache('my-recommendations', {});
    return BukkaResponse.DeleteResponse('Recommendation', true);
  }
}
