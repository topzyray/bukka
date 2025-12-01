import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { QueueService } from '../QueueService';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import {
  QueueEnvelope,
  SubscriptionHandle,
} from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';
import { RecommendationNotificationHelper } from 'src/InfrastructureLayer/Helpers/RecommendationNotificationHelper';
import { RecommendationQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/RecommendationQueueMessageTypeEnum';

@Injectable()
export class RecommendationNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    RecommendationNotificationConsumerService.name,
  );
  private subscriptionHandles: SubscriptionHandle[] = [];
  constructor(
    private readonly helper: RecommendationNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case RecommendationQueueMessageTypeEnum.RECOMMENDATION_CREATED:
          await this.helper.processNewRecommendation(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case RecommendationQueueMessageTypeEnum.RECOMMENDATION_APPROVED:
          await this.helper.processApproval(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case RecommendationQueueMessageTypeEnum.RECOMMENDATION_REJECTED:
          await this.helper.processRejection(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case RecommendationQueueMessageTypeEnum.RECOMMENDATION_DELETED:
          await this.helper.processDeletion(
            envelope.payload,
            envelope.messageType,
          );
          break;
        default:
          this.logger.warn(
            `[RecommendationNotification] Unknown message type '${envelope.messageType}'`,
          );
      }
    };

    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.RECOMMENDATION_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[RecommendationNotification] Subscribed to ${QueueEnum.RECOMMENDATION_NOTIFICATION}`,
    );
  }

  async onModuleDestroy() {
    for (const h of this.subscriptionHandles) {
      await h.close();
    }
    this.logger.log('[RecommendationNotification] Shutdown complete.');
  }
}
