import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { Support } from 'src/DomainLayer/Models/Support';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';

@Injectable()
export class SupportDataAgent {
  private readonly model: ModelProxy<Support>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Support>('support');
  }

  async createSupportAsync(data: Partial<Support>): Promise<Support | null> {
    return await this.model.insert(data);
  }

  async getSupportById(supportId: number): Promise<Support | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: supportId },
    };
    return this.model.findOne(spec);
  }

  async getSupportByTicketId(ticketId: string): Promise<Support | null> {
    const spec: QuerySpec = {
      filter: { field: 'ticketId', op: 'eq', value: ticketId },
    };
    return this.model.findOne(spec);
  }

  async getSupportByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Support[]>> {
    const pageData = new PagedData<Support[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

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

  async deleteSupport(supportId: number) {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: supportId },
    };
    await this.model.deleteOne(spec);
  }
}
