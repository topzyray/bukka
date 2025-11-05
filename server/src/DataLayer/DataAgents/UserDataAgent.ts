import { UserStatusEnum } from 'src/DomainLayer/Enums/UserStatusEnum';
import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { User } from 'src/DomainLayer/Models/User';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { IReferenceEntityAgent } from '../Abstracts/Interfaces/IReferenceEntityAgent';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { Favorite } from 'src/DomainLayer/Models/Favorite';
import { Review } from 'src/DomainLayer/Models/Review';
import { File } from 'src/DomainLayer/Models/File';
import { UserSession } from 'src/DomainLayer/Models/UserSession';
import { Business } from 'src/DomainLayer/Models/Business';

@Injectable()
export class UserDataAgent implements IReferenceEntityAgent {
  private readonly model: ModelProxy<User>;
  private readonly favouriteModel: ModelProxy<Favorite>;
  private readonly reviewModel: ModelProxy<Review>;
  private readonly fileModel: ModelProxy<File>;
  private readonly sessionModel: ModelProxy<UserSession>;
  private readonly businessModel: ModelProxy<Business>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<User>('user');
    this.favouriteModel = this.db.getModel<Favorite>('favorite');
    this.reviewModel = this.db.getModel<Review>('review');
    this.fileModel = this.db.getModel<File>('file');
    this.sessionModel = this.db.getModel<UserSession>('userSession');
    this.businessModel = this.db.getModel<Business>('business');
  }

  async createUserAsync(data: Partial<User>): Promise<User> {
    return this.model.insert(data);
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
    return this.model.findOne(spec);
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
    return this.model.findOne(spec);
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
    return this.model.findOne(spec);
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
    return this.model.findOne(spec);
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
    return this.model.findOne(spec);
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User | null> {
    const { id, ...updateData } = data;
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: userId },
    };
    return this.model.updateOne(spec, updateData);
  }

  async deleteUser(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: userId },
    };
    return this.model.updateOne(spec, {
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

    const total = await this.model.count({ filter: mergedFilter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);

    const data = await this.model.find(spec);
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
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async getAdminOverview() {
    const totalUsers = await this.model.count({});
    const newSignups = await this.model.count({
      filter: {
        field: 'createdAt',
        op: 'gte',
        value: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
      },
    });
    const activeAccounts = await this.model.count({
      filter: {
        field: 'userStatus',
        op: 'eq',
        value: UserStatusEnum.ACTIVE,
      },
    });
    const deletedAccounts = await this.model.count({
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

  async getUserActivitiesOverview(userId: number) {
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
      businesses: businesses ?? 0,
      favorites: favorites ?? 0,
      reviews: reviews ?? 0,
      files: files ?? 0,
      sessions: sessions ?? 0,
    };
  }
}
