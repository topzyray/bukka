import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import {
  QueueEnvelope,
  SubscriptionHandle,
} from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';
import { QueueService } from '../QueueService';
import { BusinessQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/BusinessQueueMessageTypeEnum';
import { BusinessNotificationHelper } from 'src/InfrastructureLayer/Helpers/BusinessNotificationHelper';

@Injectable()
export class BusinessNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    BusinessNotificationConsumerService.name,
  );
  private subscriptionHandles: SubscriptionHandle[] = [];
  constructor(
    private readonly helper: BusinessNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case BusinessQueueMessageTypeEnum.BUSINESS_CREATED:
          await this.helper.processCreated(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case BusinessQueueMessageTypeEnum.BUSINESS_UPDATED:
          await this.helper.processUpdated(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case BusinessQueueMessageTypeEnum.BUSINESS_DELETED:
          await this.helper.processDeleted(
            envelope.payload,
            envelope.messageType,
          );
          break;
        default:
          this.logger.warn(
            `[BusinessNotification] Unknown message type '${envelope.messageType}'`,
          );
      }
    };

    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.BUSINESS_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[BusinessNotification] Subscribed to ${QueueEnum.BUSINESS_NOTIFICATION}`,
    );
  }

  async onModuleDestroy() {
    for (const h of this.subscriptionHandles) await h.close();
    this.logger.log('[BusinessNotification] Shutdown complete.');
  }
}
