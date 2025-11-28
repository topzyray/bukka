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

const TOLERANCE = 1e-5;

@Injectable()
export class RecommendationRepository {
  constructor(
    private readonly recommendationDataAgent: RecommendationDataAgent,
    private readonly businessDataAgent: BusinessDataAgent,
    private readonly locationDataAgent: LocationDataAgent,
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

    await invalidateCache('recommendations', {});

    return BukkaResponse.CreateResponse('Recommendation', recommendation);
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

  async getRecommendations(
    filterDto: FilterRecommendationDto,
  ): Promise<PagedData<Recommendation[]>> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [{ field: 'type' }],
      searchConfig: {
        fields: [
          'name',
          'description',
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
    const rec = await this.recommendationDataAgent.findById(id);
    if (!rec) throw new NotFoundException('Recommendation not found');

    const business = await this.businessDataAgent.createBusiness({
      name: rec?.name,
      description: rec?.description,
      type: rec?.type,
      categoryId: rec?.categoryId,
      slug: rec?.slug,
      phoneNumber: rec?.phoneNumber ?? null,
      email: rec?.email ?? null,
      website: rec?.website ?? null,
      registrationNo: rec?.registrationNo ?? null,
      cuisines: rec?.cuisines ?? [],
      locationId: rec?.locationId,
      recommenderId: rec?.recommenderId,
      isActive: true,
    });

    await this.recommendationDataAgent.updateRecommendation(id, {
      status: RecommendationStatusEnum.APPROVED,
    });
    return BukkaResponse.CustomResponse(
      'Recommendation approved successfully. Recommendation is now live!',
      HttpStatus.OK,
      true,
      business,
    );
  }

  async rejectRecommendation(id: number) {
    const rec = await this.recommendationDataAgent.findById(id);
    if (!rec) throw new NotFoundException('Recommendation not found');
    const updated = await this.recommendationDataAgent.updateRecommendation(
      id,
      {
        status: RecommendationStatusEnum.REJECTED,
      },
    );
    await invalidateCache('recommendation', { id });
    await invalidateCache('recommendations', {});
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
    await invalidateCache('recommendation', { id });
    await invalidateCache('recommendations', {});
    return BukkaResponse.DeleteResponse('Recommendation', true);
  }
}
