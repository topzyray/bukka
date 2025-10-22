import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Review } from 'src/DomainLayer/Models/Review';
import { PagedData } from 'src/DomainLayer/Models/PagedData';

@Injectable()
export class ReviewDataAgent {
  private readonly model: ModelProxy<Review>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Review>('review');
  }

  async createReview(data: Partial<Review>): Promise<Review> {
    return this.model.insert(data);
  }

  async findById(id: number): Promise<Review | null> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return this.model.findOne(spec);
  }

  async findByUserAndBusiness(
    userId: number,
    businessId: number,
  ): Promise<Review | null> {
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

  async findByBusinessId(
    businessId: number,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Review[]>> {
    const pageData = new PagedData<Review[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const filter = { field: 'businessId', op: 'eq', value: businessId };
    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };

    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async updateReview(id: number, updateData: Partial<Review>): Promise<Review> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return (await this.model.updateOne(spec, updateData)) as Review;
  }

  async deleteReview(id: number): Promise<void> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    await this.model.deleteOne(spec);
  }
}
