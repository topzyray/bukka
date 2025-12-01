import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import {
  QueueEnvelope,
  SubscriptionHandle,
} from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';
import { OrderNotificationHelper } from 'src/InfrastructureLayer/Helpers/OrderNotificationHelper';
import { QueueService } from '../QueueService';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import { OrderQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/OrderQueueMessageTypeEnum';

@Injectable()
export class OrderNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(OrderNotificationConsumerService.name);
  private subscriptionHandles: SubscriptionHandle[] = [];
  constructor(
    private readonly helper: OrderNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case OrderQueueMessageTypeEnum.ORDER_CREATED:
          await this.helper.processOrderCreated(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case OrderQueueMessageTypeEnum.ORDER_STATUS_UPDATED:
          await this.helper.processOrderStatusUpdate(
            envelope.payload,
            envelope.messageType,
          );
          break;
        default:
          this.logger.warn(
            `[OrderNotification] Unknown message type '${envelope.messageType}'`,
          );
      }
    };

    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.ORDER_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[OrderNotification] Subscribed to ${QueueEnum.ORDER_NOTIFICATION}`,
    );
  }

  async onModuleDestroy() {
    for (const h of this.subscriptionHandles) await h.close();
    this.logger.log('[OrderNotification] Shutdown complete.');
  }
}
