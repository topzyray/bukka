import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  FilterBusinessDto,
  FilterFeaturedBusinessDto,
  FilterBusinessBoundsDto,
} from 'src/DomainLayer/Dtos/BusinessDto';
import { FileRepository } from './FileRepository';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { Business } from 'src/DomainLayer/Models/Business';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { LocationDataAgent } from 'src/DataLayer/DataAgents/LocationDataAgent';
import { BusinessDataAgent } from 'src/DataLayer/DataAgents/BusinessDataAgent';
import { QueueService } from 'src/InfrastructureLayer/Services/queue/QueueService';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { LocationCoordsHelper } from 'src/InfrastructureLayer/Helpers/LocationCoordsHelper';
import { BusinessQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/BusinessQueueMessageTypeEnum';
import { Location } from 'src/DomainLayer/Models/Location';

const TOLERANCE = 1e-5;

@Injectable()
export class BusinessRepository {
  constructor(
    private readonly businessDataAgent: BusinessDataAgent,
    private readonly locationDataAgent: LocationDataAgent,
    private readonly _queue: QueueService,
    private readonly fileRepo: FileRepository,
  ) {}

  async createBusiness(
    dto: CreateBusinessDto,
  ): Promise<BukkaResponse<Business>> {
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
    const ownerId =
      loggedInUser?.role === UserRoleEnum.ADMIN
        ? otherDto.ownerId
        : loggedInUser?.id;

    const existingBusiness = await this.businessDataAgent.findByLocation(
      location?.id as number,
    );

    if (existingBusiness) {
      return BukkaResponse.CustomResponse(
        'Business already exists.',
        HttpStatus.OK,
        true,
        existingBusiness,
      );
    }

    const business = await this.businessDataAgent.createBusiness({
      ...otherDto,
      locationId: location?.id,
      ownerId: ownerId ?? undefined,
      isActive: true,
    });

    this._queue.publishToQueue(
      QueueEnum.BUSINESS_NOTIFICATION,
      {
        messageType: BusinessQueueMessageTypeEnum.BUSINESS_CREATED,
        payload: {
          ownerId,
          firstName:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.firstName
              : loggedInUser?.firstName) ?? '',
          lastName:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.lastName
              : loggedInUser?.lastName) ?? '',
          ownerEmail:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.email
              : loggedInUser?.email) ?? '',
          businessId: business?.id,
          businessName: business?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('businesses', {});
    await invalidateCache('businesses-bounds', {});

    return BukkaResponse.CreateResponse('Business', business);
  }

  async importBusiness(
    dto: CreateBusinessDto,
  ): Promise<BukkaResponse<Business>> {
    const {
      longitude,
      latitude,
      address,
      city,
      state,
      country,
      zipCode,
      placeId,
      suburb,
      street,
      countryId,
      county,
      ...otherDto
    } = dto;

    let locationByPlaceId: Location | null = null;
    let locationByCoordinates: Location | null = null;

    if (placeId) {
      locationByPlaceId =
        await this.locationDataAgent.findLocationByPlaceId(placeId);
    } else {
      locationByCoordinates = await this.locationDataAgent.findNearbyLocation(
        longitude,
        latitude,
        TOLERANCE,
      );
    }

    let finalLocation: Location | null = null;

    if (locationByPlaceId) {
      finalLocation = locationByPlaceId;
    } else if (locationByCoordinates) {
      finalLocation = locationByCoordinates;
    } else {
      finalLocation = await this.locationDataAgent.createLocation({
        placeId,
        longitude,
        latitude,
        address,
        city,
        state,
        country,
        zipCode,
        countryId: countryId ?? '',
        street: street ?? '',
        county: county ?? '',
        suburb: suburb ?? '',
      });
    }

    const loggedInUser = await UserHelper.getLoggedInUser();
    const recommenderId = loggedInUser?.id;

    const existingBusiness = await this.businessDataAgent.findByLocation(
      finalLocation?.id as number,
    );

    if (existingBusiness) {
      return BukkaResponse.CustomResponse(
        'Business already exists.',
        HttpStatus.OK,
        true,
        existingBusiness,
      );
    }

    const business = await this.businessDataAgent.createBusiness({
      ...otherDto,
      locationId: finalLocation?.id,
      recommenderId: recommenderId ?? undefined,
      isActive: true,
    });

    this._queue.publishToQueue(
      QueueEnum.BUSINESS_NOTIFICATION,
      {
        messageType: BusinessQueueMessageTypeEnum.BUSINESS_IMPORTED,
        payload: {
          recommenderId,
          firstName: loggedInUser?.firstName,
          lastName: loggedInUser?.lastName,
          ownerEmail: loggedInUser?.email,
          businessId: business?.id,
          businessName: business?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('businesses', {});
    await invalidateCache('businesses-bounds', {});

    return BukkaResponse.CreateResponse(
      'Business',
      business,
      'New business imported successfully.',
    );
  }

  // async importFromGoogle(placeId: string) {
  //   const googleData = await this.googlePlacesService.getPlaceDetails(placeId);

  //   if (!googleData) {
  //     throw new NotFoundException('Invalid Google Place ID');
  //   }

  //   let location = await this.locationDataAgent.findLocationByPlaceId(placeId);

  //   if (!location) {
  //     location = await this.locationDataAgent.createLocation({
  //       placeId,
  //       latitude: googleData.geometry.location.lat,
  //       longitude: googleData.geometry.location.lng,
  //       address: googleData.formatted_address,
  //       city: googleData.address_components?.find((x) =>
  //         x.types.includes('locality'),
  //       )?.long_name,
  //       state: googleData.address_components?.find((x) =>
  //         x.types.includes('administrative_area_level_1'),
  //       )?.long_name,
  //       country: googleData.address_components?.find((x) =>
  //         x.types.includes('country'),
  //       )?.long_name,
  //     });
  //   }

  //   const existingBusiness = await this.businessDataAgent.findByLocation(
  //     location.id,
  //   );
  //   if (existingBusiness) {
  //     return BukkaResponse.CustomResponse(
  //       'Business already imported.',
  //       HttpStatus.OK,
  //       true,
  //       existingBusiness,
  //     );
  //   }

  //   const loggedInUser = await UserHelper.getLoggedInUser();

  //   const business = await this.businessDataAgent.createBusiness({
  //     name: googleData.name,
  //     description: googleData.editorial_summary?.overview || '',
  //     categoryId: null, // assign after mapping categories
  //     ownerId: loggedInUser.id,
  //     locationId: location.id,
  //     rating: googleData.rating,
  //     googlePlaceId: placeId,
  //     isActive: true,
  //   });

  //   return BukkaResponse.CreateResponse('Business Imported', business);
  // }

  async importPostProcess(business: Business) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const ownerId = business?.ownerId ?? loggedInUser?.id ?? null;

    this._queue.publishToQueue(
      QueueEnum.BUSINESS_NOTIFICATION,
      {
        messageType: BusinessQueueMessageTypeEnum.BUSINESS_CREATED,
        payload: {
          ownerId,
          firstName: loggedInUser?.firstName ?? '',
          lastName: loggedInUser?.lastName ?? '',
          ownerEmail: loggedInUser?.email ?? '',
          businessId: business?.id,
          businessName: business?.name,
        },
      },
      { provider: QueueProviderEnum.BULLMQ },
    );

    await invalidateCache('businesses', {});
    await invalidateCache('businesses-bounds', {});
  }

  async getBusinessById(id: number): Promise<BukkaResponse<Business>> {
    return handleCache(
      'business',
      { id },
      async () => {
        const business = await this.businessDataAgent.findById(id);
        if (!business) throw new NotFoundException('Business not found');
        return BukkaResponse.GetSingleDataResponse('Business', business);
      },
      CacheTTLPolicyEnum.BUSINESS_DETAIL,
    );
  }

  async getBusinessesByOwner(
    filterDto: FilterBusinessDto,
  ): Promise<PagedData<Business[]>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    let processedFilterDto = {
      ...filterDto,
      ...(loggedInUser &&
        loggedInUser?.role === UserRoleEnum.VENDOR && {
          ownerId: loggedInUser?.id,
        }),
    };

    const query = FilterQueryHelper.buildQuery({
      dto: processedFilterDto,
      rules: [{ field: 'type' }, { field: 'ownerId' }],
      // rules: [{ field: 'type' }, { field: 'cuisines' }],
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
      FilterQueryHelper.extractPagination(processedFilterDto);
    return handleCache(
      'my-businesses',
      processedFilterDto as Record<string, any>,
      () => {
        return this.businessDataAgent.findAll(query, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.MY_BUSINESS_LIST,
    );
  }

  async getBusinesses(
    filterDto: FilterBusinessDto,
  ): Promise<PagedData<Business[]>> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [{ field: 'type' }],
      // rules: [{ field: 'type' }, { field: 'cuisines' }],
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
      'businesses',
      filterDto as Record<string, any>,
      () => {
        return this.businessDataAgent.findAll(query, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.BUSINESS_LIST,
    );
  }

  async getFeaturedBusinesses(
    filterDto: FilterFeaturedBusinessDto,
  ): Promise<PagedData<Business[]>> {
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return handleCache(
      'featured-businesses',
      filterDto as Record<string, any>,
      () => {
        return this.businessDataAgent.findFeaturedBusinesses(
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.FEATURED_BUSINESS_LIST,
    );
  }

  async getBusinessesBounds(filterDto: FilterBusinessBoundsDto) {
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return handleCache(
      'businesses-bounds',
      this.normalizeBounds(filterDto),
      () => {
        return this.businessDataAgent.findBusinessesWithBounds(
          filterDto,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.BUSINESS_BOUNDS,
    );
  }

  async updateBusiness(
    id: number,
    dto: UpdateBusinessDto,
  ): Promise<BukkaResponse<Business>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const business = await this.businessDataAgent.findById(id);

    if (!business) throw new NotFoundException('Business not found');
    if (business.ownerId !== loggedInUser.id)
      throw new ForbiddenException('Unauthorized update');

    const updated = await this.businessDataAgent.updateBusiness(
      business.id,
      dto,
    );

    this._queue.publishToQueue(
      QueueEnum.BUSINESS_NOTIFICATION,
      {
        messageType: BusinessQueueMessageTypeEnum.BUSINESS_UPDATED,
        payload: {
          ownerId:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.id
              : loggedInUser?.id) ?? '',
          firstName:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.firstName
              : loggedInUser?.firstName) ?? '',
          lastName:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.lastName
              : loggedInUser?.lastName) ?? '',
          ownerEmail:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.email
              : loggedInUser?.email) ?? '',
          businessId: business?.id,
          businessName: business?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('business', { id });
    await invalidateCache('businesses', {});
    await invalidateCache('my-businesses', {});
    await invalidateCache('businesses-bounds', {});
    return BukkaResponse.UpdateResponse('Business', updated);
  }

  async setBusinessFeatured(
    businessId: number,
    data: {
      isFeatured: boolean;
      featuredRank?: number;
      featuredEnd?: Date;
    },
  ) {
    const business = await this.businessDataAgent.findById(businessId);
    if (!business) throw new NotFoundException('Business not found');

    const loggedInUser = await UserHelper.getLoggedInUser();
    if (loggedInUser.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException('Only admins can feature businesses');
    }

    const updated = await this.businessDataAgent.updateBusiness(business.id, {
      isFeatured: data.isFeatured,
      featuredRank: data.featuredRank,
      featuredStart: new Date(),
      featuredEnd: data.featuredEnd,
    });

    this._queue.publishToQueue(
      QueueEnum.BUSINESS_NOTIFICATION,
      {
        messageType: BusinessQueueMessageTypeEnum.BUSINESS_FEATURED,
        payload: {
          adminId: loggedInUser.id,
          adminEmail: loggedInUser.email,
          adminfirstName: loggedInUser?.firstName,
          adminlastName: loggedInUser?.lastName,
          ownerEmail: business?.owner?.email,
          ownerId: business?.owner?.id,
          ownerFirstName: business?.owner?.firstName,
          ownerLastName: business?.owner?.lastName,
          recommenderEmail: business?.recommender?.email,
          recommenderId: business?.recommender?.id,
          recommenderFirstName: business?.recommender?.firstName,
          recommenderLastName: business?.recommender?.lastName,
          businessId: business.id,
          businessName: business?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await invalidateCache('featured-businesses', {});
    await invalidateCache('businesses', {});
    await invalidateCache('businesses-bounds', {});

    return BukkaResponse.UpdateResponse('Business Featured Status', updated);
  }

  async deleteBusiness(id: number): Promise<BukkaResponse<void>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const business = await this.businessDataAgent.findById(id);

    if (!business) throw new NotFoundException('Business not found');
    if (
      business.ownerId !== loggedInUser.id ||
      loggedInUser.role !== UserRoleEnum.ADMIN
    )
      throw new ForbiddenException('Unauthorized delete');

    this._queue.publishToQueue(
      QueueEnum.BUSINESS_NOTIFICATION,
      {
        messageType: BusinessQueueMessageTypeEnum.BUSINESS_DELETED,
        payload: {
          ownerId:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.id
              : loggedInUser?.id) ?? '',
          firstName:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.firstName
              : loggedInUser?.firstName) ?? '',
          lastName:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.lastName
              : loggedInUser?.lastName) ?? '',
          ownerEmail:
            (loggedInUser?.role === UserRoleEnum.ADMIN
              ? business?.owner?.email
              : loggedInUser?.email) ?? '',
          businessId: business?.id,
          businessName: business?.name,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    await this.businessDataAgent.deleteBusiness(id);
    await invalidateCache('business', { id });
    await invalidateCache('businesses', {});
    await invalidateCache('my-businesses', {});
    await invalidateCache('businesses-bounds', {});
    return BukkaResponse.DeleteResponse('Business', true);
  }

  private normalizeBounds(b: FilterBusinessBoundsDto) {
    const precision = 3; // ~100m
    return {
      ...b,
      north: Number(b.north.toFixed(precision)),
      south: Number(b.south.toFixed(precision)),
      east: Number(b.east.toFixed(precision)),
      west: Number(b.west.toFixed(precision)),
    };
  }

  // async addFileToRestaurant(
  //   businessId: number,
  //   fileId: number,
  // ): Promise<BukkaResponse<any>> {
  //   const business = await this.getBusinessById(businessId);
  //   if (!business) {
  //     return BukkaResponse.ErrorResponse(
  //       'Business not found.',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const file = await this.fileRepo.getFileById(fileId);
  //   if (!file) {
  //     return BukkaResponse.ErrorResponse(
  //       'File not found.',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   if (file.referenceId !== businessId) {
  //     return BukkaResponse.ErrorResponse(
  //       `File ID ${file.id} is not associated with business with the business with ID ${businessId}`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const fileAlreadyExist =
  //     await this.businessDataAgent.fileExistsInBusinessImages(
  //       businessId,
  //       file?.id as number,
  //     );

  //   if (fileAlreadyExist) {
  //     return BukkaResponse.CustomResponse(
  //       'File already connected to the business',
  //       HttpStatus.CONFLICT,
  //       false,
  //       null,
  //     );
  //   }

  //   const result = await this.connectBusinessFile(
  //     business?.id as number,
  //     fileId,
  //   );
  //   if (!result) {
  //     return BukkaResponse.ErrorResponse('Failed to connect file to business.');
  //   }

  //   return BukkaResponse.CustomResponse(
  //     'File connected to business successfully',
  //     HttpStatus.OK,
  //     true,
  //     result,
  //   );
  // }

  // private async connectBusinessFile(businessId: number, fileId: number) {
  //   const result = this.businessDataAgent.connectBusnessFile(
  //     businessId,
  //     fileId,
  //   );
  //   return result;
  // }

  // private async connectMultipleBusinessFiles(
  //   businessId: number,
  //   fileIds: number[],
  // ) {
  //   const result = this.businessDataAgent.connectBusinessFiles(
  //     businessId,
  //     fileIds,
  //   );
  //   return result;
  // }
}
