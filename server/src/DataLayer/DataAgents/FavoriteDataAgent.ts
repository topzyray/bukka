import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Favorite } from 'src/DomainLayer/Models/Favorite';
import { PagedData } from 'src/DomainLayer/Models/PagedData';

@Injectable()
export class FavoriteDataAgent {
  private readonly model: ModelProxy<Favorite>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Favorite>('favorite');
  }

  async createFavorite(data: Partial<Favorite>): Promise<Favorite> {
    return this.model.insert(data);
  }

  async findByUserAndBusiness(
    userId: number,
    businessId: number,
  ): Promise<Favorite | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'userId', op: 'eq', value: userId },
          { field: 'businessId', op: 'eq', value: businessId },
        ],
      },
    };
    return this.model.findOne(spec);
  }

  async getUserFavorites(
    userId: number,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Favorite[]>> {
    const pageData = new PagedData<Favorite[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };
    const total = await this.model.count({
      filter: { field: 'userId', op: 'eq', value: userId },
    });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async deleteFavorite(id: number): Promise<void> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    await this.model.deleteOne(spec);
  }
}
