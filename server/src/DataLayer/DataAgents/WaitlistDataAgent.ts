import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Waitlist } from 'src/DomainLayer/Models/Waitlist';

@Injectable()
export class WaitlistDataAgent {
  private readonly model: ModelProxy<Waitlist>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Waitlist>('waitlist');
  }

  async createWaitlistAsync(data: Partial<Waitlist>): Promise<Waitlist> {
    return this.model.insert(data);
  }

  async getWaitlistByUserEmail(email: string) {
    const spec: QuerySpec = {
      filter: { field: 'email', op: 'eq', value: email },
    };
    return this.model.findOne(spec);
  }

  async getWaitlistById(id: number): Promise<Waitlist | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    return this.model.findOne(spec);
  }

  async getWaitlistByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Waitlist[]>> {
    const pageData = new PagedData<Waitlist[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter: filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };

    const total = await this.model.count({ filter: filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);

    const data = await this.model.find(spec);
    pageData.data = data;
    return pageData;
  }

  async deleteWaitlist(id: number): Promise<void> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    return this.model.deleteOne(spec);
  }
}
