import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Location } from 'src/DomainLayer/Models/Location';

@Injectable()
export class LocationDataAgent {
  private readonly model: ModelProxy<Location>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Location>('location');
  }

  async findLocationByPlaceId(placeId: string): Promise<Location | null> {
    const spec: QuerySpec = {
      filter: { field: 'placeId', op: 'eq', value: placeId },
    };
    return await this.model.findOne(spec);
  }

  async createLocation(data: Partial<Location>): Promise<Location> {
    return await this.model.insert(data);
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
}
