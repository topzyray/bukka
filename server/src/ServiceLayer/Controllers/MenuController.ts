@Controller(`${BaseApiRoutesConstant.BASE_URL}/menus`)
@ApiTags('Menus')
export class MenuController {
  constructor(private readonly menuRepository: MenuRepository) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMenu(@Body() dto: CreateMenuDto, @Res() res: Response) {
    const response = await this.menuRepository.createMenu(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  async getMenus(@Query() filter: MenuFilterDto, @Res() res: Response) {
    const response = await this.menuRepository.getMenusByFilters(filter);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':menuId')
  async getMenuById(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Res() res: Response,
  ) {
    const response = await this.menuRepository.getMenuById(menuId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateMenu(@Body() dto: UpdateMenuDto, @Res() res: Response) {
    const response = await this.menuRepository.updateMenu(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':menuId')
  @UseGuards(JwtAuthGuard)
  async deleteMenu(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Res() res: Response,
  ) {
    const response = await this.menuRepository.deleteMenu(menuId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
