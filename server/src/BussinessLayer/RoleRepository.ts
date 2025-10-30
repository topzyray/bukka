import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { RoleDataAgent } from 'src/DataLayer/DataAgents/RoleDataAgent';
import { CreateRoleDto } from 'src/DomainLayer/Dtos/Admin/RoleDto';

@Injectable()
export class RoleRepository {
  constructor(private readonly dataAgent: RoleDataAgent) {}

  async createRole(dto: CreateRoleDto) {
    const existing = await this.dataAgent.findByRoleName(dto.name);
    if (existing) throw new BadRequestException('Role already exists.');

    const created = await this.dataAgent.createRole(dto);
    await invalidateCache('roles', {});
    return BukkaResponse.CreateResponse('Role', created);
  }

  async getById(id: number) {
    return handleCache(
      'role',
      { id },
      async () => {
        const cat = await this.dataAgent.findById(id);
        if (!cat) throw new NotFoundException('Role not found');
        return BukkaResponse.GetSingleDataResponse('Role', cat);
      },
      CacheTTLPolicyEnum.ROLE,
    );
  }

  async getAllRoles() {
    return handleCache(
      'roles',
      {},
      () => {
        return this.dataAgent.findAll();
      },
      CacheTTLPolicyEnum.ROLE,
    );
  }

  // async update(id: number, dto: UpdateBusinessCategoryDto) {
  //   const existing = await this.dataAgent.findById(id);
  //   if (!existing) throw new NotFoundException('Role not found');
  //   const updated = await this.dataAgent.updateRole(id, dto as any);
  //   await invalidateCache('role', { id });
  //   await invalidateCache('roles', {});
  //   return BukkaResponse.UpdateResponse('Role', updated);
  // }

  // async delete(id: number) {
  //   const existing = await this.dataAgent.findById(id);
  //   if (!existing) throw new NotFoundException('Role not found');
  //   await this.dataAgent.deleteRole(id);
  //   await invalidateCache('role', { id });
  //   await invalidateCache('roles', {});
  //   return BukkaResponse.DeleteResponse('Role', true);
  // }
}
