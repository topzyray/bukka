import { EmailService } from '../email/EmailService';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from 'src/DomainLayer/Dtos/UserNotificationDto';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { UserNotificationRepository } from 'src/BusinessLayer/UserNotificationRepository';
import { NotificationSettingsRepository } from 'src/BusinessLayer/NotificationSettingsRepository';

interface ChannelInput {
  channels: NotificationTypeEnum[];
  inapp?: {
    userId: number | number[];
    title: string;
    message: string;
    link?: string;
    notificationCategory: string;
    icon?: string;
  };
  email?: {
    template: string;
    subject: string;
    to: string;
    context: Record<string, any>;
  };
}

interface NotificationSettings {
  isEmailTurnedOn: boolean;
  isInAppTurnedOn: boolean;
  isPushTurnedOn: boolean;
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  isEmailTurnedOn: true,
  isInAppTurnedOn: true,
  isPushTurnedOn: true,
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private static readonly BATCH_SIZE = 100;

  constructor(
    protected readonly _notif: UserNotificationRepository,
    protected readonly _emailService: EmailService,
    private readonly _settingsRepo: NotificationSettingsRepository,
  ) {}

  async dispatchNotification(input: ChannelInput) {
    const settings = await this.getUserNotificationSettings();

    for (const channel of input.channels) {
      try {
        switch (channel) {
          case NotificationTypeEnum.IN_APP:
            if (settings.isInAppTurnedOn && input.inapp) {
              await this.handleInAppNotification(input.inapp);
            }
            break;
          case NotificationTypeEnum.EMAIL:
            if (settings.isEmailTurnedOn && input.email) {
              await this.handleEmailNotification(input.email);
            }
            break;
          default:
            this.logger.warn(`Unknown notification channel: ${channel}`);
            break;
        }
      } catch (error) {
        this.logger.error(
          `Error processing notification for channel ${channel}: ${error?.message}`,
        );
      }
    }
  }

  private async handleInAppNotification(inapp: ChannelInput['inapp']) {
    if (!inapp) return;

    const { userId, title, message, link, notificationCategory, icon } = inapp;

    if (!title || !message || !notificationCategory) {
      throw new BadRequestException(
        'In-app notification payload is incomplete.',
      );
    }

    if (typeof userId === 'number') {
      await this._notif.createUserNotification({
        userId,
        title,
        message,
        link,
        notificationCategory,
        icon,
      });
      return;
    }

    if (Array.isArray(userId) && userId?.length === 0) {
      throw new BadRequestException('User ID array cannot be empty.');
    }

    for (let i = 0; i < userId?.length; i += NotificationService.BATCH_SIZE) {
      const batch = userId?.slice(i, i + NotificationService.BATCH_SIZE);

      const notifications: CreateNotificationDto[] = batch.map((uid) => ({
        userId: uid,
        title,
        message,
        link,
        notificationCategory,
        icon,
      }));

      await this._notif.createMultipleUsersNotification(notifications);
    }
  }

  private async handleEmailNotification(email: ChannelInput['email']) {
    if (!email) return;
    const { template, subject, to, context } = email;
    if (!template || !subject || !to) {
      throw new BadRequestException(
        'Email notification payload is incomplete.',
      );
    }
    await this._emailService.sendTemplateMail({
      template,
      subject,
      to,
      context,
    });
  }

  private async getUserNotificationSettings(): Promise<NotificationSettings> {
    const settings =
      await this._settingsRepo.getLoggedInUserNotificationSetting();
    const userSettings =
      settings?.responseData?.settings ?? DEFAULT_NOTIFICATION_SETTINGS;
    return userSettings;
  }
}
