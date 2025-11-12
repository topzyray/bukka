@Controller(`${BaseApiRoutesConstant.BASE_URL}/orders`)
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly orderRepository: OrderRepository) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() dto: CreateOrderDto, @Res() res: Response) {
    const response = await this.orderRepository.createOrder(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  async getOrders(@Query() filter: OrderFilterDto, @Res() res: Response) {
    const response = await this.orderRepository.getOrdersByFilters(filter);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':orderId')
  async getOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const response = await this.orderRepository.getOrderById(orderId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateOrder(@Body() dto: UpdateOrderDto, @Res() res: Response) {
    const response = await this.orderRepository.updateOrder(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':orderId')
  @UseGuards(JwtAuthGuard)
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const response = await this.orderRepository.deleteOrder(orderId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
