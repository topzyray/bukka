import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Location } from 'src/DomainLayer/Models/Location';
import { PagedData } from 'src/DomainLayer/Models/PagedData';

@Injectable()
export class LocationDataAgent {
  private readonly model: ModelProxy<Location>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Location>('location');
  }

  async createLocation(data: Partial<Location>): Promise<Location> {
    return await this.model.insert(data);
  }

  async findLocationById(id: number): Promise<Location | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    return await this.model.findOne(spec);
  }

  async findLocationByPlaceId(placeId: string): Promise<Location | null> {
    const spec: QuerySpec = {
      filter: { field: 'placeId', op: 'eq', value: placeId },
    };
    return await this.model.findOne(spec);
  }

  async findNearbyLocation(
    long: number,
    lat: number,
    tolerance: number,
  ): Promise<Location | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'longitude', op: 'gte', value: long - tolerance },
          { field: 'longitude', op: 'lte', value: long + tolerance },
          { field: 'latitude', op: 'gte', value: lat - tolerance },
          { field: 'latitude', op: 'lte', value: lat + tolerance },
        ],
      },
    };
    return await this.model.findOne(spec);
  }

  async getLocationsByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Location[]>> {
    const pageData = new PagedData<Location[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    console.log('FILTERS: ', filter);

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };

    console.log('QUERY: ', spec);

    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async updateLocation(
    id: number,
    updateData: Partial<Location>,
  ): Promise<Location> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    return (await this.model.updateOne(spec, updateData)) as Location;
  }

  async deleteLocation(id: number): Promise<void> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    await this.model.deleteOne(spec);
  }
}
