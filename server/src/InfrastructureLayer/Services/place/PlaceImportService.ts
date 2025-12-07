import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { handleCache } from '../cache/CacheUtils';
import { Location } from 'src/DomainLayer/Models/Location';
import { PlaceProviderFactory } from './PlaceProviderFactory';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { BusinessRepository } from 'src/BussinessLayer/BusinessRepository';
import { PlaceProviderEnum } from 'src/DomainLayer/Enums/PlaceProviderEnum';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { BusinessDataAgent } from 'src/DataLayer/DataAgents/BusinessDataAgent';
import { LocationDataAgent } from 'src/DataLayer/DataAgents/LocationDataAgent';
import {
  AdminPlaceImportDto,
  AdminPlaceSearchDto,
} from 'src/DomainLayer/Dtos/Admin/AdminPlaceDto';
import {
  PlaceProviderSearchOptions,
  PlaceSearchResult,
} from 'src/DataLayer/Abstracts/Interfaces/IPlaceProvider';
import { BusinessCategoryDataAgent } from 'src/DataLayer/DataAgents/BusinessCategoryDataAgent';

@Injectable()
export class PlaceImportService {
  constructor(
    private readonly factory: PlaceProviderFactory,
    private readonly locationDataAgent: LocationDataAgent,
    private readonly businessDataAgent: BusinessDataAgent,
    private readonly businessRepository: BusinessRepository,
    private readonly businessCategoryDataAgent: BusinessCategoryDataAgent,
  ) {}

  async search(
    providerName: PlaceProviderEnum,
    opts: PlaceProviderSearchOptions,
  ): Promise<PlaceSearchResult[]> {
    return handleCache(
      'places-search',
      { ...opts, providerName },
      () => {
        const provider = this.factory.getProvider(providerName);
        return provider.search(opts);
      },
      CacheTTLPolicyEnum.PLACES_IMPORT,
    );
  }

  async importSingle(adminPlaceDto: AdminPlaceImportDto) {
    const {
      categoryId,
      provider: providerName,
      externalId,
      recommendedByUserId,
    } = adminPlaceDto;
    const category = await this.businessCategoryDataAgent.findById(categoryId);
    if (!category) throw new BadRequestException('Invalid categoryId');

    const provider = this.factory.getProvider(providerName);
    const detail = await provider.getDetails(externalId);
    if (!detail)
      throw new NotFoundException('Place details not found from provider');

    const existingLocation =
      await this.locationDataAgent.findLocationByPlaceId(externalId);

    let location: Location | null;
    if (!existingLocation) {
      location = await this.locationDataAgent.createLocation({
        placeId: externalId,
        latitude: detail.lat,
        longitude: detail.lng,
        address: detail.address ?? '',
        city: undefined,
        state: undefined,
        country: undefined,
      } as any);
    } else {
      location = existingLocation;
    }

    const existingBusiness = await this.businessDataAgent.findByLocation(
      location.id,
    );
    if (existingBusiness) {
      return BukkaResponse.CustomResponse(
        'Business already exists',
        HttpStatus.OK,
        true,
        existingBusiness,
      );
    }

    const createPayload: any = {
      name: detail?.name,
      description:
        detail.raw?.editorial_summary?.overview ||
        detail.address ||
        `Imported place: ${detail.name}` ||
        detail.raw?.description ||
        detail?.address ||
        '',
      categoryId: categoryId,
      recommendedBy: recommendedByUserId,
      locationId: location?.id,
      rating: detail.rating ?? 0,
      googlePlaceId:
        providerName === PlaceProviderEnum.GOOGLE ? detail.externalId : null,
      // you may want to store provider type and external id on business model too
      //   externalProvider: provider.name,
      externalPlaceId: detail.externalId,
      isActive: true,
    };

    const created = await this.businessDataAgent.createBusiness(createPayload);

    await this.businessRepository.importPostProcess(created);

    return BukkaResponse.CreateResponse(
      'Business',
      created,
      'Business imported successfully.',
    );
  }
}
