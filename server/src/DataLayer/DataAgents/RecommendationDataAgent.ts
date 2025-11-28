import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Recommendation } from 'src/DomainLayer/Models/Recommendation';
import { PagedData } from 'src/DomainLayer/Models/PagedData';

@Injectable()
export class RecommendationDataAgent {
  private readonly model: ModelProxy<Recommendation>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Recommendation>('recommendation');
  }

  async createRecommendation(
    data: Partial<Recommendation>,
  ): Promise<Recommendation> {
    return this.model.insert(data);
  }

  async findById(id: number): Promise<Recommendation | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
      extras: {
        include: {
          category: true,
          location: true,
          recommender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    };
    return this.model.findOne(spec);
  }

  async findByLocation(locationId: number): Promise<Recommendation | null> {
    const spec: QuerySpec = {
      filter: { field: 'locationId', op: 'eq', value: locationId },
    };
    return this.model.findOne(spec);
  }

  async findByRecommenderId(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Recommendation[]>> {
    const pageData = new PagedData<Recommendation[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          category: true,
          location: true,
          recommender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    };
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async findAll(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Recommendation[]>> {
    const pageData = new PagedData<Recommendation[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          category: true,
          location: true,
          recommender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    };
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async updateRecommendation(
    id: number,
    data: Partial<Recommendation>,
  ): Promise<Recommendation> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return this.model.updateOne(spec, data) as Promise<Recommendation>;
  }

  async deleteRecommendation(id: number): Promise<void> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    await this.model.deleteOne(spec);
  }
}
