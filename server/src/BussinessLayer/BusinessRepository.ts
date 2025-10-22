import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { BusinessDataAgent } from 'src/DataLayer/DataAgents/BusinessDataAgent';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { Business } from 'src/DomainLayer/Models/Business';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  FilterBusinessDto,
} from 'src/DomainLayer/Dtos/BusinessDto';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { LocationDataAgent } from 'src/DataLayer/DataAgents/LocationDataAgent';
import { FileRepository } from './FileRepository';
import { LocationCoordsHelper } from 'src/InfrastructureLayer/Helpers/LocationCoordsHelper';

const TOLERANCE = 1e-5;

@Injectable()
export class BusinessRepository {
  constructor(
    private readonly businessDataAgent: BusinessDataAgent,
    private readonly locationDataAgent: LocationDataAgent,
    private readonly fileRepo: FileRepository,
  ) {}

  async createBusiness(
    dto: CreateBusinessDto,
  ): Promise<BukkaResponse<Business>> {
    const { longitude, latitude, ...otherDto } = dto;

    let location = await this.locationDataAgent.findNearbyLocation(
      longitude,
      latitude,
      TOLERANCE,
    );

    console.log('EXISITING LOCATION: ', location);

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
        //  address,
        // placeId,
        // city,
        // state,
        // country,
        // zipCode,
      };
      location = await this.locationDataAgent.createLocation(newLocationData);
      console.log('NEW LOCATION: ', location);
    }

    const loggedInUser = await UserHelper.getLoggedInUser();
    const ownerId =
      loggedInUser?.role === UserRoleEnum.ADMIN
        ? otherDto.ownerId
        : loggedInUser?.id;

    const existingBusiness = await this.businessDataAgent.findByLocation(
      location?.id as number,
    );
    console.log('EXISITING BUSINESS: ', existingBusiness);
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
      ownerId,
      isActive: true,
    });
    console.log('NEW BUSINESS: ', business);

    return BukkaResponse.CreateResponse('Business', business);
  }

  async getBusinessById(id: number): Promise<BukkaResponse<Business>> {
    const business = await this.businessDataAgent.findById(id);
    if (!business) throw new NotFoundException('Business not found');
    return BukkaResponse.GetSingleDataResponse('Business', business);
  }

  async getBusinessesByOwner(): Promise<BukkaResponse<Business>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const business = await this.businessDataAgent.findByOwnerId(
      loggedInUser.id,
    );
    return BukkaResponse.GetSingleDataResponse('Business', business);
  }

  async getBusinesses(
    filterDto: FilterBusinessDto,
  ): Promise<PagedData<Business[]>> {
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return this.businessDataAgent.findAll(pageSize, pageNumber);
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

    const updated = await this.businessDataAgent.updateBusiness(id, dto);
    return BukkaResponse.UpdateResponse('Business', updated);
  }

  async deleteBusiness(id: number): Promise<BukkaResponse<void>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const business = await this.businessDataAgent.findById(id);

    if (!business) throw new NotFoundException('Business not found');
    if (business.ownerId !== loggedInUser.id)
      throw new ForbiddenException('Unauthorized delete');

    await this.businessDataAgent.deleteBusiness(id);
    return BukkaResponse.DeleteResponse('Business', true);
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
