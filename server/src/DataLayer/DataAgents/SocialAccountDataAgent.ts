import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { SocialAccount } from 'src/DomainLayer/Models/SocialAccount';

@Injectable()
export class SocialAccountDataAgent {
  private readonly model: ModelProxy<SocialAccount>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<SocialAccount>('socialAccount');
  }

  async findByProvider(provider: string, providerId: string) {
    const spec: QuerySpec = {
      filter: {
        AND: [
          { field: 'provider', op: 'eq', value: provider },
          { field: 'providerId', op: 'eq', value: providerId },
        ],
      },
    };
    return this.model.findOne(spec);
  }

  async findByUserId(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    return this.model.find(spec);
  }

  async create(data: Partial<SocialAccount>) {
    return this.model.insert(data);
  }

  async deleteById(id: number) {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return this.model.deleteOne(spec);
  }
}
