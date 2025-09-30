import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { NotificationSettings } from 'src/DomainLayer/Models/NotificationSetting';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';

@Injectable()
export class NotificationSettingsDataAgent {
  private readonly model: ModelProxy<NotificationSettings>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<NotificationSettings>('notificationSettings');
  }

  async createNotificationSetting(
    data: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    return this.model.insert(data);
  }

  async getNotificationSettingById(
    notificationId: number,
  ): Promise<NotificationSettings | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: notificationId },
    };
    return this.model.findOne(spec);
  }

  async getNotificationSettingByUserId(
    userId: number,
  ): Promise<NotificationSettings | null> {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    return this.model.findOne(spec);
  }

  async getNotificationSettingsByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<NotificationSettings[]>> {
    const pageData = new PagedData<NotificationSettings[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };

    if (this.db.transaction) {
      return this.db.transaction(async (tx) => {
        const m = tx.getModel<NotificationSettings>('notificationSettings');
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

  async updateNotificationSetting(data: Partial<NotificationSettings>) {
    const { id: notificationId, ...updateData } = data;
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: notificationId },
    };
    return this.model.updateOne(spec, updateData);
  }

  async deleteUserNotificationSetting(
    id: number,
  ): Promise<NotificationSettings | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
    };
    await this.model.deleteOne(spec);
    return null;
  }

  async deleteNotificationSettingsByUserId(userId: string) {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    const result = await this.model.deleteMany(spec);
    return result;
  }
}
