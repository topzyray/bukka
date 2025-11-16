import {
  CreateOrderDto,
  OrderFilterDto,
  UpdateOrderDto,
} from 'src/DomainLayer/Dtos/OrderDto';
import { Order } from 'src/DomainLayer/Models/Order';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { OrderDataAgent } from 'src/DataLayer/DataAgents/OrderDataAgent';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';

@Injectable()
export class OrderRepository {
  constructor(private readonly orderDataAgent: OrderDataAgent) {}

  async createOrder(dto: CreateOrderDto): Promise<BukkaResponse<Order>> {
    // validate user, vendor, business exist
    const order = await this.orderDataAgent.createOrder(dto);
    return BukkaResponse.CreateResponse('Order', order);
  }

  async getOrderById(id: number): Promise<BukkaResponse<Order>> {
    return handleCache(
      'order',
      { id },
      async () => {
        const order = await this.orderDataAgent.findById(id);
        if (!order) throw new NotFoundException('Order not found');
        return BukkaResponse.GetSingleDataResponse('Order', order);
      },
      CacheTTLPolicyEnum.ORDER_DETAILS,
    );
  }

  async getOrdersByFilters(
    filter: OrderFilterDto,
  ): Promise<PagedData<Order[]>> {
    return handleCache(
      'orders',
      filter as Record<string, any>,
      () => {
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filter);
        return this.orderDataAgent.findByFilters(filter, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.ORDERS,
    );
  }

  async updateOrder(dto: UpdateOrderDto) {
    const order = await this.orderDataAgent.findById(dto.orderId);
    if (!order) throw new NotFoundException('Order not found');
    // role-based permission checks...
    const updated = await this.orderDataAgent.updateOrder(dto.orderId, dto);
    await invalidateCache('orders', {});
    await invalidateCache('orders', { businessId: order.businessId });
    await invalidateCache('order', { id: order.id });
    return BukkaResponse.UpdateResponse('Order', updated);
  }

  async deleteOrder(id: number) {
    await this.orderDataAgent.deleteOrder(id);
    await invalidateCache('orders', {});
    await invalidateCache('order', { id });
    return BukkaResponse.DeleteResponse('Order', true);
  }
}
