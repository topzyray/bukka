import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { UserPersonalization } from 'src/DomainLayer/Models/UserPersonalization';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';

@Injectable()
export class UserPersonalizationDataAgent {
  private readonly model: ModelProxy<UserPersonalization>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<UserPersonalization>('userPersonalization');
  }

  async createUserPersonalization(
    data: Partial<UserPersonalization>,
  ): Promise<UserPersonalization> {
    return this.model.insert(data);
  }

  async getUserPersonalizationById(
    personalizationId: number,
  ): Promise<UserPersonalization | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: personalizationId },
    };
    return this.model.findOne(spec);
  }

  async getUserPersonalizationByUserId(
    userId: number,
  ): Promise<UserPersonalization | null> {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    return this.model.findOne(spec);
  }

  async getUserPersonalizationByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<UserPersonalization[]>> {
    const pageData = new PagedData<UserPersonalization[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };

    if (this.db.transaction) {
      return this.db.transaction(async (tx) => {
        const m = tx.getModel<UserPersonalization>('notificationSettings');
        const total = await m.count({ filter });
        pageData.total = total;
        pageData.pageCount = Math.ceil(total / pageSize);

        const data = await m.find(spec);
        pageData.data = data;
        return pageData;
      }) as any;
    } else {
      const total = await this.model.count({ filter });
      pageData.total = total;
      pageData.pageCount = Math.ceil(total / pageSize);

      const data = await this.model.find(spec);
      pageData.data = data;
      return pageData;
    }
  }

  async updateUserPersonalization(data: Partial<UserPersonalization>) {
    const { userId, ...updateData } = data;
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    return this.model.updateOne(spec, updateData);
  }

  async deleteUserPersonalization(
    id: number,
  ): Promise<UserPersonalization | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    await this.model.deleteOne(spec);
    return null;
  }

  async deleteUserPersonalizationByUserId(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    const result = await this.model.deleteMany(spec);
    return result;
  }
}
