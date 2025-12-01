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
import { ReviewNotificationHelper } from 'src/InfrastructureLayer/Helpers/ReviewNotificationHelper';
import { ReviewQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/ReviewQueueMessageTypeEnum';

@Injectable()
export class ReviewNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ReviewNotificationConsumerService.name);
  private subscriptionHandles: SubscriptionHandle[] = [];
  constructor(
    private readonly helper: ReviewNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case ReviewQueueMessageTypeEnum.NEW_REVIEW:
          await this.helper.processNewReview(
            envelope.payload,
            envelope.messageType,
          );
          break;

        default:
          this.logger.warn(
            `[ReviewNotification] Unknown message type '${envelope.messageType}'`,
          );
      }
    };

    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.REVIEW_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[ReviewNotification] Subscribed to ${QueueEnum.REVIEW_NOTIFICATION}`,
    );
  }

  async onModuleDestroy() {
    for (const h of this.subscriptionHandles) await h.close();
    this.logger.log('[ReviewNotification] Shutdown complete.');
  }
}
