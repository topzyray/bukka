@Injectable()
export class OrderRepository {
  constructor(private readonly orderDataAgent: OrderDataAgent) {}

  async createOrder(dto: CreateOrderDto) {
    // validate user, vendor, business exist
    const order = await this.orderDataAgent.createOrder(dto);
    return BukkaResponse.CreateResponse('Order', order);
  }

  async getOrderById(id: number) {
    const order = await this.orderDataAgent.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return BukkaResponse.GetSingleDataResponse('Order', order);
  }

  async getOrdersByFilters(filter: OrderFilterDto) {
    return handleCache(
      'orders',
      filter,
      () => {
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filter);
        return this.orderDataAgent.findByFilters(filter, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.ORDER,
    );
  }

  async updateOrder(dto: UpdateOrderDto) {
    const order = await this.orderDataAgent.findById(dto.orderId);
    if (!order) throw new NotFoundException('Order not found');
    // role-based permission checks...
    const updated = await this.orderDataAgent.updateOrder(dto.orderId, dto);
    return BukkaResponse.UpdateResponse('Order', updated);
  }

  async deleteOrder(id: number) {
    await this.orderDataAgent.deleteOrder(id);
    return BukkaResponse.DeleteResponse('Order', true);
  }
}
