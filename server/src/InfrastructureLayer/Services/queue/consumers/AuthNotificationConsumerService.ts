import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import {
  QueueEnvelope,
  SubscriptionHandle,
} from 'src/DataLayer/Abstracts/Interfaces/IQueueProvider';
import { QueueService } from '../QueueService';
import { QueueEnum } from '../../../../DomainLayer/Enums/Queue/QueueEnum';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import { AuthNotificationHelper } from '../../../Helpers/AuthNotificationHelper';
import { AuthQueueMessageTypeEnum } from '../../../../DomainLayer/Enums/Queue/AuthQueueMessageTypeEnum';

@Injectable()
export class AuthNotificationConsumerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(AuthNotificationConsumerService.name);
  private subscriptionHandles: SubscriptionHandle[] = [];

  constructor(
    private readonly notificationHelper: AuthNotificationHelper,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    const handler = async (envelope: QueueEnvelope<any>) => {
      switch (envelope.messageType) {
        case AuthQueueMessageTypeEnum.SIGNUP:
          await this.notificationHelper.processSignup(
            envelope.payload,
            AuthQueueMessageTypeEnum.SIGNUP,
          );
          break;
        case AuthQueueMessageTypeEnum.CONFIRM_EMAIL:
          await this.notificationHelper.processAccountConfirmation(
            envelope.payload,
            AuthQueueMessageTypeEnum.CONFIRM_EMAIL,
          );
          break;
        case AuthQueueMessageTypeEnum.FORGOT_PASSWORD:
          await this.notificationHelper.processForgotPassword(
            envelope.payload,
            AuthQueueMessageTypeEnum.FORGOT_PASSWORD,
          );
          break;
        case AuthQueueMessageTypeEnum.RESEND_CONFIRMATION_EMAIL:
          await this.notificationHelper.processResendConfirmation(
            envelope.payload,
            AuthQueueMessageTypeEnum.RESEND_CONFIRMATION_EMAIL,
          );
          break;
        case AuthQueueMessageTypeEnum.REFERRER_SIGNUP:
          await this.notificationHelper.processReferralSignup(
            envelope.payload,
            AuthQueueMessageTypeEnum.REFERRER_SIGNUP,
          );
          break;
        default:
          this.logger.warn(
            `[AuthNotification] Unknown message type '${envelope.messageType}', skipping.`,
          );
      }
    };

    // Subscribe to all providers at once
    this.subscriptionHandles =
      await this.queueService.subscribeToMultipleProviders(
        QueueEnum.AUTH_NOTIFICATION,
        handler,
        [QueueProviderEnum.BULLMQ],
        {
          maxConcurrentCalls: 10,
          autoComplete: false,
          receiveMode: 'peekLock',
        },
      );

    this.logger.log(
      `[AuthNotification] Subscribed to queue '${QueueEnum.AUTH_NOTIFICATION}' on all providers.`,
    );
  }

  async onModuleDestroy() {
    for (const handle of this.subscriptionHandles) {
      await handle.close();
    }
    this.logger.log('[AuthNotification] Shutdown complete.');
  }
}

// @Injectable()
// export class AuthNotificationConsumerService
//   implements OnModuleInit, OnModuleDestroy
// {
//   private readonly logger = new Logger(AuthNotificationConsumerService.name);

//   private subscriptionHandle: { close: () => Promise<void> } | null = null;

//   constructor(
//     private readonly notificationHelper: AuthNotificationHelper,
//     private readonly queueService: QueueService,
//   ) {}

//   async onModuleInit() {
//     this.subscriptionHandle = await this.queueService.subscribeToQueue(
//       QueueEnum.AUTH_NOTIFICATION,
//       async (envelope) => {
//         switch (envelope.messageType) {
//           case AuthQueueMessageTypeEnum.SIGNUP:
//             await this.notificationHelper.processSignup(
//               envelope.payload,
//               AuthQueueMessageTypeEnum.SIGNUP,
//             );
//             break;
//           case AuthQueueMessageTypeEnum.CONFIRM_EMAIL:
//             await this.notificationHelper.processAccountConfirmation(
//               envelope.payload,
//               AuthQueueMessageTypeEnum.CONFIRM_EMAIL,
//             );
//             break;
//           case AuthQueueMessageTypeEnum.FORGOT_PASSWORD:
//             await this.notificationHelper.processForgotPassword(
//               envelope.payload,
//               AuthQueueMessageTypeEnum.FORGOT_PASSWORD,
//             );
//             break;
//           case AuthQueueMessageTypeEnum.RESEND_CONFIRMATION_EMAIL:
//             await this.notificationHelper.processResendConfirmation(
//               envelope.payload,
//               AuthQueueMessageTypeEnum.RESEND_CONFIRMATION_EMAIL,
//             );
//             break;
//           case AuthQueueMessageTypeEnum.REFERRER_SIGNUP:
//             await this.notificationHelper.processReferralSignup(
//               envelope.payload,
//               AuthQueueMessageTypeEnum.REFERRER_SIGNUP,
//             );
//             break;
//           default:
//             this.logger.warn(
//               `[AuthNotification] Unknown message type '${envelope.messageType}', skipping.`,
//             );
//         }
//       },
//       {
//         provider: QueueProviderEnum.BULLMQ,
//         maxConcurrentCalls: 10,
//         autoComplete: false,
//         receiveMode: 'peekLock',
//       },
//     );

//     this.logger.log(
//       '[AuthNotification] Subscribed to queue:',
//       QueueEnum.AUTH_NOTIFICATION,
//     );
//   }

//   async onModuleDestroy() {
//     await this.subscriptionHandle?.close();
//     this.logger.log('[AuthNotification] Shutdown complete.');
//   }
// }
