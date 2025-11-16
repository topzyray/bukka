import {
  CreateMenuDto,
  MenuFilterDto,
  UpdateMenuDto,
} from 'src/DomainLayer/Dtos/MenuDto';
import { Menu } from 'src/DomainLayer/Models/Menu';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { MenuDataAgent } from 'src/DataLayer/DataAgents/MenuDataAgent';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';

@Injectable()
export class MenuRepository {
  constructor(private readonly menuDataAgent: MenuDataAgent) {}

  async createMenu(dto: CreateMenuDto): Promise<BukkaResponse<Menu>> {
    const menu = await this.menuDataAgent.createMenu(dto);
    await invalidateCache('menus', {});
    await invalidateCache('menus', { businessId: dto.businessId });
    return BukkaResponse.CreateResponse('Menu', menu);
  }

  async getMenuById(id: number): Promise<BukkaResponse<Menu>> {
    return handleCache(
      'menu',
      { id },
      async () => {
        const menu = await this.menuDataAgent.findById(id);
        if (!menu) throw new NotFoundException('Menu not found');
        return BukkaResponse.GetSingleDataResponse('Menu', menu);
      },
      CacheTTLPolicyEnum.MENU_DETAILS,
    );
  }

  async getMenusByFilters(filter: MenuFilterDto): Promise<PagedData<Menu[]>> {
    return handleCache(
      'menus',
      filter as Record<string, any>,
      () => {
        const query = FilterQueryHelper.buildQuery({
          dto: filter,
          rules: [{ field: 'businessId' }, { field: 'isActive' }],
        });
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filter);
        return this.menuDataAgent.findByFilters(query, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.MENU,
    );
  }

  async updateMenu(dto: UpdateMenuDto) {
    const menu = await this.menuDataAgent.findById(dto.menuId);
    if (!menu) throw new NotFoundException('Menu not found');
    const updated = await this.menuDataAgent.updateMenu(dto.menuId, dto);
    await invalidateCache('menus', {});
    await invalidateCache('menus', { businessId: menu.businessId });
    await invalidateCache('menu', { id: menu.id });
    return BukkaResponse.UpdateResponse('Menu', updated);
  }

  async deleteMenu(id: number) {
    const menu = await this.menuDataAgent.findById(id);
    if (!menu) throw new NotFoundException('Menu not found');
    await this.menuDataAgent.deleteMenu(id);
    await invalidateCache('menus', {});
    await invalidateCache('menus', { businessId: menu.businessId });
    await invalidateCache('menu', { id: menu.id });
    return BukkaResponse.DeleteResponse('Menu', true);
  }
}
