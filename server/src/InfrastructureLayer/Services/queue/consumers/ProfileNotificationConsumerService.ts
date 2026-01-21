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
import { ProfileQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/ProfileQueueMessageTypeEnum';
import { QueueService } from '../QueueService';
import { ProfileNotificationHelper } from 'src/InfrastructureLayer/Helpers/ProfileNotificationHelper';

@Injectable()
export class ProfileNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ProfileNotificationConsumerService.name);
  private subscriptionHandles: SubscriptionHandle[] = [];
  constructor(
    private readonly helper: ProfileNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case ProfileQueueMessageTypeEnum.PASSWORD_CHANGE:
          await this.helper.processPasswordChange(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case ProfileQueueMessageTypeEnum.PROFILE_ONBOARDED:
          await this.helper.processProfileOnboarding(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case ProfileQueueMessageTypeEnum.PROFILE_UPDATED:
          await this.helper.processProfileUpdate(
            envelope.payload,
            envelope.messageType,
          );
          break;
        case ProfileQueueMessageTypeEnum.OAUTH_USER_ROLE_ASSIGNMENT:
          await this.helper.processOAuthRoleAssignment(
            envelope.payload,
            envelope.messageType,
          );
          break;
        default:
          this.logger.warn(
            `[ProfileNotification] Unknown message type '${envelope.messageType}'`,
          );
      }
    };

    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.PROFILE_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[ProfileNotification] Subscribed to ${QueueEnum.PROFILE_NOTIFICATION}`,
    );
  }

  async onModuleDestroy() {
    for (const h of this.subscriptionHandles) await h.close();
    this.logger.log('[ProfileNotification] Shutdown complete.');
  }
}
