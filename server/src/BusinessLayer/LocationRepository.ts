import { Injectable, BadRequestException } from '@nestjs/common';
import { LocationDataAgent } from 'src/DataLayer/DataAgents/LocationDataAgent';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  CreateLocationDto,
  UpdateLocationDto,
  FilterLocationDto,
  SearchLocationDto,
} from 'src/DomainLayer/Dtos/LocationDto';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Location } from 'src/DomainLayer/Models/Location';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';

@Injectable()
export class LocationRepository {
  constructor(private readonly locationDataAgent: LocationDataAgent) {}

  async createLocation(
    dto: CreateLocationDto,
  ): Promise<BukkaResponse<Location>> {
    if (
      !dto.placeId &&
      (dto.latitude === undefined || dto.longitude === undefined)
    ) {
      throw new BadRequestException(
        'Either placeId or latitude/longitude must be provided.',
      );
    }

    if (dto.placeId) {
      const existing = await this.locationDataAgent.findLocationByPlaceId(
        dto.placeId,
      );
      if (existing) {
        return BukkaResponse.CreateResponse('Location', existing);
      }
    }

    const created = await this.locationDataAgent.createLocation(dto as any);
    await invalidateCache('locations:search', {});
    return BukkaResponse.CreateResponse('Location', created);
  }

  async findLocationById(id: number): Promise<BukkaResponse<Location | null>> {
    const location = await this.locationDataAgent.findLocationById(id);
    if (!location) {
      return BukkaResponse.ErrorResponse('Location not found', 404);
    }
    return BukkaResponse.GetSingleDataResponse('Location', location);
  }

  async findLocations(
    filterDto: FilterLocationDto,
  ): Promise<PagedData<Location[]>> {
    return handleCache(
      'locations:list',
      filterDto as Record<string, any>,
      async () => {
        const query = FilterQueryHelper.buildQuery({
          dto: filterDto,
          rules: [
            { field: 'placeId' },
            { field: 'city' },
            { field: 'state' },
            { field: 'country' },
          ],
          searchConfig: {
            fields: ['address', 'city', 'state', 'country'],
            mode: 'insensitive',
          },
        });
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filterDto);
        return this.locationDataAgent.getLocationsByFilter(
          query,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.LOCATION,
    );
  }

  async searchLocations(
    searchFilters: SearchLocationDto,
  ): Promise<PagedData<Location[]>> {
    return handleCache(
      'locations:search',
      searchFilters as Record<any, any>,
      () => {
        const query = FilterQueryHelper.buildQuery({
          dto: searchFilters,
          rules: [{ field: 'search' }],
          searchConfig: {
            fields: ['address', 'city', 'state', 'country'],
            mode: 'insensitive',
          },
        });

        const { pageNumber, pageSize } =
          FilterQueryHelper.extractPagination(searchFilters);
        return this.locationDataAgent.getLocationsByFilter(
          query,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.LOCATION,
    );
  }

  async updateLocation(
    id: number,
    dto: UpdateLocationDto,
  ): Promise<BukkaResponse<Location>> {
    const existing = await this.locationDataAgent.findLocationById(id);
    if (!existing) {
      return BukkaResponse.ErrorResponse('Location not found', 404);
    }
    const updated = await this.locationDataAgent.updateLocation(id, dto as any);
    await invalidateCache('location', { id });
    await invalidateCache('locations:search', {});
    return BukkaResponse.UpdateResponse('Location', updated);
  }

  async deleteLocation(id: number): Promise<BukkaResponse<void>> {
    const existing = await this.locationDataAgent.findLocationById(id);
    if (!existing) {
      return BukkaResponse.ErrorResponse('Location not found', 404);
    }
    await this.locationDataAgent.deleteLocation(id);
    await invalidateCache('location', { id });
    await invalidateCache('locations:search', {});
    return BukkaResponse.DeleteResponse('Location', true);
  }

  async findLocationByPlaceId(placeId: string): Promise<Location | null> {
    return await this.locationDataAgent.findLocationByPlaceId(placeId);
  }
}
