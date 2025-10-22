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

@Injectable()
export class LocationRepository {
  constructor(private readonly locationDataAgent: LocationDataAgent) {}

  /**
   * Create a new location (can be from Google PlaceId or manual lat/lng)
   */
  async createLocation(
    dto: CreateLocationDto,
  ): Promise<BukkaResponse<Location>> {
    // Basic validation (placeId or lat/lng)
    if (
      !dto.placeId &&
      (dto.latitude === undefined || dto.longitude === undefined)
    ) {
      throw new BadRequestException(
        'Either placeId or latitude/longitude must be provided.',
      );
    }

    // If placeId is provided, attempt to prevent duplicates by placeId
    if (dto.placeId) {
      const existing = await this.locationDataAgent.findLocationByPlaceId(
        dto.placeId,
      );
      if (existing) {
        return BukkaResponse.CreateResponse('Location', existing);
      }
    }

    const created = await this.locationDataAgent.createLocation(dto as any);
    return BukkaResponse.CreateResponse('Location', created);
  }

  /**
   * Find a single location by id
   */
  async findLocationById(id: number): Promise<BukkaResponse<Location | null>> {
    const location = await this.locationDataAgent.findLocationById(id);
    if (!location) {
      return BukkaResponse.ErrorResponse('Location not found', 404);
    }
    return BukkaResponse.GetSingleDataResponse('Location', location);
  }

  /**
   * Find locations by filters (supports pagination)
   */
  async findLocations(
    filterDto: FilterLocationDto,
  ): Promise<PagedData<Location[]>> {
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
    return await this.locationDataAgent.getLocationsByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async searchLocations(
    searchFilters: SearchLocationDto,
  ): Promise<PagedData<Location[]>> {
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
    return await this.locationDataAgent.getLocationsByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  /**
   * Update a location by id
   */
  async updateLocation(
    id: number,
    dto: UpdateLocationDto,
  ): Promise<BukkaResponse<Location>> {
    const existing = await this.locationDataAgent.findLocationById(id);
    if (!existing) {
      return BukkaResponse.ErrorResponse('Location not found', 404);
    }
    const updated = await this.locationDataAgent.updateLocation(id, dto as any);
    return BukkaResponse.UpdateResponse('Location', updated);
  }

  /**
   * Delete a location
   */
  async deleteLocation(id: number): Promise<BukkaResponse<void>> {
    const existing = await this.locationDataAgent.findLocationById(id);
    if (!existing) {
      return BukkaResponse.ErrorResponse('Location not found', 404);
    }
    await this.locationDataAgent.deleteLocation(id);
    return BukkaResponse.DeleteResponse('Location', true);
  }

  /**
   * Find a location by placeId helper (passes through)
   */
  async findLocationByPlaceId(placeId: string): Promise<Location | null> {
    return await this.locationDataAgent.findLocationByPlaceId(placeId);
  }
}
