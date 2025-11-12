@Injectable()
export class MenuRepository {
  constructor(private readonly menuDataAgent: MenuDataAgent) {}

  async createMenu(dto: CreateMenuDto) {
    const menu = await this.menuDataAgent.createMenu(dto);
    await invalidateCache('menus', { businessId: dto.businessId });
    return BukkaResponse.CreateResponse('Menu', menu);
  }

  async getMenuById(id: number) {
    const menu = await this.menuDataAgent.findById(id);
    if (!menu) throw new NotFoundException('Menu not found');
    return BukkaResponse.GetSingleDataResponse('Menu', menu);
  }

  async getMenusByFilters(filter: MenuFilterDto) {
    return handleCache(
      'menus',
      filter,
      () => {
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filter);
        return this.menuDataAgent.findByFilters(filter, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.MENU,
    );
  }

  async updateMenu(dto: UpdateMenuDto) {
    const menu = await this.menuDataAgent.findById(dto.menuId);
    if (!menu) throw new NotFoundException('Menu not found');
    const updated = await this.menuDataAgent.updateMenu(dto.menuId, dto);
    await invalidateCache('menus', { businessId: menu.businessId });
    return BukkaResponse.UpdateResponse('Menu', updated);
  }

  async deleteMenu(id: number) {
    const menu = await this.menuDataAgent.findById(id);
    if (!menu) throw new NotFoundException('Menu not found');
    await this.menuDataAgent.deleteMenu(id);
    await invalidateCache('menus', { businessId: menu.businessId });
    return BukkaResponse.DeleteResponse('Menu', true);
  }
}
