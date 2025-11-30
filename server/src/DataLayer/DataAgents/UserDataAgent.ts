import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { User } from 'src/DomainLayer/Models/User';
import { File } from 'src/DomainLayer/Models/File';
import { Inject, Injectable } from '@nestjs/common';
import { Review } from 'src/DomainLayer/Models/Review';
import { Favorite } from 'src/DomainLayer/Models/Favorite';
import { Business } from 'src/DomainLayer/Models/Business';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { UserSession } from 'src/DomainLayer/Models/UserSession';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { UserStatusEnum } from 'src/DomainLayer/Enums/UserStatusEnum';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';
import { BusinessTypeEnum } from 'src/DomainLayer/Enums/BusinessTypeEnum';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { IReferenceEntityAgent } from '../Abstracts/Interfaces/IReferenceEntityAgent';

@Injectable()
export class UserDataAgent implements IReferenceEntityAgent {
  private readonly userModel: ModelProxy<User>;
  private readonly favouriteModel: ModelProxy<Favorite>;
  private readonly reviewModel: ModelProxy<Review>;
  private readonly fileModel: ModelProxy<File>;
  private readonly sessionModel: ModelProxy<UserSession>;
  private readonly businessModel: ModelProxy<Business>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.userModel = this.db.getModel<User>('user');
    this.favouriteModel = this.db.getModel<Favorite>('favorite');
    this.reviewModel = this.db.getModel<Review>('review');
    this.fileModel = this.db.getModel<File>('file');
    this.sessionModel = this.db.getModel<UserSession>('userSession');
    this.businessModel = this.db.getModel<Business>('business');
  }

  async createUserAsync(data: Partial<User>): Promise<User> {
    return this.userModel.insert(data);
  }

  async getUserByEmail(email: string) {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'email', op: 'eq', value: email },
          { field: 'isDeleted', op: 'eq', value: false },
        ],
      },
      extras: {
        include: {
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    };
    return this.userModel.findOne(spec);
  }

  async getUserById(userId: number): Promise<User | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'id', op: 'eq', value: userId },
          { field: 'isDeleted', op: 'eq', value: false },
        ],
      },
      extras: {
        include: {
          authSessions: true,
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    };
    return this.userModel.findOne(spec);
  }

  async getById(id: number) {
    return this.getUserById(id);
  }

  async getUserByToken(
    token: string,
    type: TokenTypeEnum,
  ): Promise<User | null> {
    const spec: QuerySpec = {
      filter: { field: type, op: 'eq', value: token },
    };
    return this.userModel.findOne(spec);
  }

  async getAdminUserById(userId: number): Promise<User | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'id', op: 'eq', value: userId },
          { field: 'role', op: 'eq', value: UserRoleEnum.ADMIN },
          { field: 'isDeleted', op: 'eq', value: false },
        ],
      },
      extras: {
        include: {
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    };
    return this.userModel.findOne(spec);
  }

  async getAdminUserByRole(): Promise<User | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'role', op: 'eq', value: UserRoleEnum.ADMIN },
          { field: 'isDeleted', op: 'eq', value: false },
        ],
      },
    };
    return this.userModel.findOne(spec);
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User | null> {
    const { id, ...updateData } = data;
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: userId },
    };
    return this.userModel.updateOne(spec, updateData);
  }

  async deleteUser(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: userId },
    };
    return this.userModel.updateOne(spec, {
      userStatus: UserStatusEnum.DELETED,
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  async getUsersByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<User[]>> {
    const pageData = new PagedData<User[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const mergedFilter = FilterQueryHelper.mergeFilterWithCondition(filter, {
      field: 'isDeleted',
      op: 'eq',
      value: false,
    });

    const spec: QuerySpec = {
      filter: mergedFilter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    };

    const total = await this.userModel.count({ filter: mergedFilter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);

    const data = await this.userModel.find(spec);
    pageData.data = data;
    return pageData;
  }

  async adminGetUsersByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<User[]>> {
    const pageData = new PagedData<User[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;
    console.log('FILTERS: ', filter);

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    };
    const total = await this.userModel.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.userModel.find(spec);
    return pageData;
  }

  async getAdminOverview() {
    const totalUsers = await this.userModel.count({});
    const newSignups = await this.userModel.count({
      filter: {
        field: 'createdAt',
        op: 'gte',
        value: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
      },
    });
    const activeAccounts = await this.userModel.count({
      filter: {
        field: 'userStatus',
        op: 'eq',
        value: UserStatusEnum.ACTIVE,
      },
    });
    const deletedAccounts = await this.userModel.count({
      filter: {
        field: 'userStatus',
        op: 'eq',
        value: UserStatusEnum.DELETED,
      },
    });
    return {
      totalUsers: totalUsers,
      newSignups: newSignups,
      activeAccounts: activeAccounts,
      deletedAccounts: deletedAccounts,
    };
  }

  async getUserActivitiesSummary(userId: number) {
    const businesses = await this.businessModel.count({
      filter: {
        field: 'ownerId',
        op: 'eq',
        value: userId,
      },
    });

    const favorites = await this.favouriteModel.count({
      filter: {
        field: 'userId',
        op: 'eq',
        value: userId,
      },
    });

    const reviews = await this.reviewModel.count({
      filter: {
        field: 'userId',
        op: 'eq',
        value: userId,
      },
    });

    const files = await this.fileModel.count({
      filter: {
        field: 'referenceId',
        op: 'eq',
        value: userId,
      },
    });

    const sessions = await this.sessionModel.count({
      filter: {
        field: 'userId',
        op: 'eq',
        value: userId,
      },
    });

    return {
      businesses: businesses,
      favorites: favorites,
      reviews: reviews,
      files: files,
      sessions: sessions,
    };
  }

  async getMonthlyUserRegistrations(
    months = 6,
  ): Promise<{ month: string; users: number }[]> {
    // Prisma doesn't have a built-in "group by month" in the adapter generic,
    // but we provide a simple implementation via raw query escape hatch if available.
    // If raw is not available on adapter, fallback to simple per-month counts.
    try {
      if (
        typeof (this.userModel as any).aggregate === 'function' &&
        (this.userModel as any).aggregate
      ) {
        // if adapter supports aggregate pipeline, implement here (adapter-specific)
        // fallback to loop below
      }
    } catch {
      // ignore - will fallback
    }

    const monthsArr: { month: string; start: Date; end: Date }[] = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, -1);
      monthsArr.push({
        month: start.toLocaleString('en-US', { month: 'short' }),
        start,
        end,
      });
    }

    const result: { month: string; users: number }[] = [];
    for (const m of monthsArr) {
      const count = await this.userModel.count({
        filter: {
          AND: [
            { field: 'createdAt', op: 'gte', value: m.start },
            { field: 'createdAt', op: 'lte', value: m.end },
            { field: 'isDeleted', op: 'eq', value: false },
          ],
        },
      });
      result.push({ month: m.month, users: count });
    }

    return result;
  }

  /**
   * Business status distribution - counts by status
   * returns array [{ name: 'Active', value: 234 }, ...]
   */
  async getBusinessStatusDistribution(): Promise<
    { name: string; value: number }[]
  > {
    // const statuses = [
    //   {
    //     name: 'Active',
    //     filter: { field: 'status', op: 'eq', value: 'ACTIVE' },
    //   },
    //   {
    //     name: 'Pending',
    //     filter: { field: 'status', op: 'eq', value: 'PENDING' },
    //   },
    //   {
    //     name: 'Suspended',
    //     filter: { field: 'status', op: 'eq', value: 'SUSPENDED' },
    //   },
    // ];

    const types = [
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.BAKERY),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.BAKERY },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.BAR),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.BAR },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.CATERING),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.CATERING },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.DELIVERY_SERVICE),
        filter: {
          field: 'type',
          op: 'eq',
          value: BusinessTypeEnum.DELIVERY_SERVICE,
        },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.FAST_FOOD),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.FAST_FOOD },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.FOOD_VENDOR),
        filter: {
          field: 'type',
          op: 'eq',
          value: BusinessTypeEnum.FOOD_VENDOR,
        },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.GROCERY),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.GROCERY },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.LOUNGE),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.LOUNGE },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.RESTAURANT),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.RESTAURANT },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.STREET_EATRY),
        filter: {
          field: 'type',
          op: 'eq',
          value: BusinessTypeEnum.STREET_EATRY,
        },
      },
      {
        name: TextHelper.normalizeText(BusinessTypeEnum.OTHER),
        filter: { field: 'type', op: 'eq', value: BusinessTypeEnum.OTHER },
      },
    ];

    const out: { name: string; value: number }[] = [];
    for (const s of types) {
      const count = await this.businessModel.count({ filter: s.filter });
      out.push({ name: s.name, value: count ?? 0 });
    }
    return out;
  }

  /**
   * Orders per day for the last N days (default 7)
   * Requires that your DB exposes an "order" userModel — if not, you can adapt to your order userModel
   */
  async getOrdersPerDay(
    lastNDays = 7,
  ): Promise<{ day: string; orders: number }[]> {
    // Attempt to use a raw query if available to group by date for performance,
    // otherwise perform looped counts.
    // Fallback: loop lastNDays and count orders with createdAt between day start and end.
    const result: { day: string; orders: number }[] = [];
    const now = new Date();
    for (let i = lastNDays - 1; i >= 0; i--) {
      const dayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i,
        0,
        0,
        0,
        0,
      );
      const dayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i,
        23,
        59,
        59,
        999,
      );

      // if you have orderModel in this agent, replace `this.userModel` with this.orderModel
      // I will assume you have an order userModel available via the adapter on a different agent;
      // If not, you should move this implementation to the data agent owning orders.
      try {
        const orderModel = this.db.getModel('order'); // using db escape hatch
        const count = await orderModel.count({
          filter: {
            AND: [
              { field: 'createdAt', op: 'gte', value: dayStart },
              { field: 'createdAt', op: 'lte', value: dayEnd },
            ],
          },
        });
        result.push({
          day: dayStart.toLocaleString('en-US', { weekday: 'short' }),
          orders: count,
        });
      } catch {
        // If order userModel is unavailable, push zero; caller can adapt
        result.push({
          day: dayStart.toLocaleString('en-US', { weekday: 'short' }),
          orders: 0,
        });
      }
    }
    return result;
  }

  /**
   * Recent activity: returns latest N events across system (simple composite from business/review/notification)
   * The shape will be [{ action, user, time }]
   */
  async getRecentActivities(
    limit = 10,
  ): Promise<{ action: string; user: string; time: Date }[]> {
    // If you have an activity/log table, use it. Otherwise derive from recent business creations, reviews, etc.
    const activities: { action: string; user: string; time: Date }[] = [];

    const recentBusinesses = await this.businessModel.find({
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: 1, pageSize: limit },
      extras: {
        include: {
          owner: true,
        },
      },
    });
    for (const b of recentBusinesses) {
      activities.push({
        action: 'New restaurant registered',
        user: (b?.name as string) ?? 'Unknown',
        time: b?.createdAt,
      });
    }

    const recentReviews = await this.reviewModel.find({
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: 1, pageSize: limit },
      extras: {
        include: {
          user: true,
        },
      },
    });
    for (const r of recentReviews) {
      activities.push({
        action: 'New review posted',
        user: r?.user?.username as string,
        time: r?.createdAt,
      });
    }

    const recentSessions = await this.sessionModel.find({
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: 1, pageSize: limit },
      extras: {
        include: {
          user: true,
        },
      },
    });
    for (const s of recentSessions) {
      activities.push({
        action: 'User logged in',
        user: (s?.user?.email as string) ?? 'User',
        time: s?.createdAt,
      });
    }

    // combine, sort by time desc and return top `limit`
    activities.sort((a, b) => b.time.getTime() - a.time.getTime());
    return activities.slice(0, limit);
  }
}
