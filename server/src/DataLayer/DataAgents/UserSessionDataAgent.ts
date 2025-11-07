import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { UserSession } from 'src/DomainLayer/Models/UserSession';

@Injectable()
export class UserSessionDataAgent {
  private readonly model: ModelProxy<UserSession>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<UserSession>('userSession');
  }

  async createSession(data: Partial<UserSession>): Promise<UserSession> {
    return this.model.insert(data);
  }

  async getSessionById(sessionId: number): Promise<UserSession | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: sessionId },
    };
    return this.model.findOne(spec);
  }

  async getSessionByRefreshToken(
    refreshToken: string,
  ): Promise<UserSession | null> {
    const spec: QuerySpec = {
      filter: { field: 'refreshToken', op: 'eq', value: refreshToken },
    };
    return this.model.findOne(spec);
  }

  async getSessionByUserIdAndDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<UserSession | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'userId', op: 'eq', value: userId },
          { field: 'deviceId', op: 'eq', value: deviceId },
        ],
      },
    };
    return this.model.findOne(spec);
  }

  async getAllSessions(userId: number): Promise<UserSession[]> {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
      sort: [{ field: 'createdAt', direction: 'desc' }],
    };
    return await this.model.find(spec);
  }

  async updateSession(sessionId: number, data: Partial<UserSession>) {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: sessionId },
    };
    return this.model.updateOne(spec, data);
  }

  async deleteSessionById(id: number) {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return this.model.deleteOne(spec);
  }

  async deleteSessionByUserIdAndDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<UserSession | null> {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'id', op: 'eq', value: userId },
          { field: 'deviceId', op: 'eq', value: deviceId },
        ],
      },
    };
    await this.model.deleteOne(spec);
    return null;
  }

  async deleteAllUserSessions(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    const result = await this.model.deleteMany(spec);
    return result;
  }
}
