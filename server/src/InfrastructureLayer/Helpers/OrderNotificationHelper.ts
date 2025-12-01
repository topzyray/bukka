import { Injectable } from '@nestjs/common';
import {
  ProcessOrderCreatedDto,
  ProcessOrderStatusDto,
} from 'src/DomainLayer/Dtos/OrderNotifictaionHelperDto';
import { OrderNotificationService } from '../Services/notification/services/OrderNotificationService';

@Injectable()
export class OrderNotificationHelper {
  constructor(private readonly service: OrderNotificationService) {}

  async processOrderCreated(data: ProcessOrderCreatedDto, category: string) {
    await this.service.processOrderCreated(data, category);
  }

  async processOrderStatusUpdate(
    data: ProcessOrderStatusDto,
    category: string,
  ) {
    await this.service.processOrderStatusUpdate(data, category);
  }
}
