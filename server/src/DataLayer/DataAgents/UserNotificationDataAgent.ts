import { DatabaseConstant } from './../../DomainLayer/Constants/DatabaseConstant';
import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from '../../DomainLayer/Models/PagedData';
import { ResponseHelper } from 'src/InfrastructureLayer/Helpers/ResponseHelper';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { UserNotification } from 'src/DomainLayer/Models/UserNotification';

@Injectable()
export class UserNotificationDataAgent {
  private readonly model: ModelProxy<UserNotification>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<UserNotification>('userNotification');
  }

  async createUserNotification(
    data: Partial<UserNotification>,
  ): Promise<UserNotification> {
    return this.model.insert(data);
  }

  async createMultipleUserNotifications(data: Partial<UserNotification>[]) {
    // If adapter supports bulk insert via extras, it can be used. Safe fallback: loop.
    const out: UserNotification[] = [];
    for (const d of data) out.push(await this.model.insert(d));
    return out;
  }

  async getUserNotificationById(
    notificationId: number,
  ): Promise<UserNotification | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: notificationId },
    };
    return this.model.findOne(spec);
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'userId', op: 'eq', value: userId },
          { field: 'isRead', op: 'eq', value: false },
        ],
      },
    };
    return this.model.count(spec);
  }

  async getUserNotificationsByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<UserNotification[]>> {
    const pageData = new PagedData<UserNotification[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };

    if (this.db.transaction) {
      return this.db.transaction(async (tx) => {
        const m = tx.getModel<UserNotification>('userNotification');
        const total = await m.count({ filter });
        pageData.total = total;
        pageData.pageCount = Math.ceil(total / pageSize);
        pageData.data = await m.find(spec);
        return pageData;
      }) as any;
    } else {
      const total = await this.model.count({ filter });
      pageData.total = total;
      pageData.pageCount = Math.ceil(total / pageSize);
      pageData.data = await this.model.find(spec);

      return pageData;
    }
  }

  async updateUserNotification(
    notificationId: number,
    updateData: Partial<UserNotification>,
  ) {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: notificationId },
    };
    return this.model.updateOne(spec, updateData);
  }

  async viewAllUserNotification(userId: number) {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'userId', op: 'eq', value: userId },
          { field: 'isRead', op: 'eq', value: false },
        ],
      },
    };
    const result = await this.model.updateMany(spec, { isRead: true });
    return ResponseHelper.handleResponseWithCount(result);
  }

  async deleteNotification(notificationId: number) {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: notificationId },
    };
    await this.model.deleteOne(spec);
    return null;
  }

  async deleteAllUserNotifications(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    const result = await this.model.deleteMany(spec);
    return ResponseHelper.handleResponseWithCount(result);
  }
}
