import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Role } from 'src/DomainLayer/Models/Role';

@Injectable()
export class RoleDataAgent {
  private readonly model: ModelProxy<Role>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Role>('role');
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    return await this.model.insert(data);
  }

  async findById(id: number): Promise<Role | null> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return await this.model.findOne(spec);
  }

  async findByRoleName(role: string): Promise<Role | null> {
    const spec: QuerySpec = {
      filter: { field: 'name', op: 'eq', value: role },
    };
    return await this.model.findOne(spec);
  }

  async findAll(): Promise<Role[]> {
    const spec: QuerySpec = {
      sort: [{ field: 'createdAt', direction: 'desc' }],
    };
    return await this.model.find(spec);
  }

  async updateRole(id: number, updateData: Partial<Role>): Promise<Role> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return (await this.model.updateOne(spec, updateData)) as Role;
  }

  async deleteRole(id: number): Promise<void> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    await this.model.deleteOne(spec);
  }
}
