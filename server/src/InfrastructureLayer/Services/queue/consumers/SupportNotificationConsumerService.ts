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
import { SupportQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/SupportQueueMessageTypeEnum copy';
import { SupportNotificationHelper } from 'src/InfrastructureLayer/Helpers/SupportNotificationHelper';
import { QueueService } from '../QueueService';

@Injectable()
export class SupportNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(SupportNotificationConsumerService.name);
  private subscriptionHandles: SubscriptionHandle[] = [];
  constructor(
    private readonly helper: SupportNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case SupportQueueMessageTypeEnum.SUPPORT_TICKET_CREATED:
          await this.helper.processNewTicket(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case SupportQueueMessageTypeEnum.SUPPORT_TICKET_ASSIGNED:
          await this.helper.processAssigned(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case SupportQueueMessageTypeEnum.SUPPORT_TICKET_RESOLVED:
          await this.helper.processResolved(
            envelope.payload,
            envelope.messageType,
          );
          break;
        default:
          this.logger.warn(
            `[SupportNotification] Unknown message type '${envelope.messageType}'`,
          );
      }
    };

    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.SUPPORT_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[SupportNotification] Subscribed to ${QueueEnum.SUPPORT_NOTIFICATION}`,
    );
  }

  async onModuleDestroy() {
    for (const h of this.subscriptionHandles) await h.close();
    this.logger.log('[SupportNotification] Shutdown complete.');
  }
}
