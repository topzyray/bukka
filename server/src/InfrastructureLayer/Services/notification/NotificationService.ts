import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/EmailService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { UserNotification } from 'src/DomainLayer/Models/UserNotification';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';

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

  constructor(
    protected readonly _notif: UserNotificationRepository,
    protected readonly _emailService: EmailService,
    private readonly _settingsRepo: NotificationSettingsRepository,
  ) {}

  async dispatchNotification(input: {
    channels: NotificationTypeEnum[];
    userId?: number;
    // businessId?: string;
    inapp?: {
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
      context: any;
    };
  }) {
    const settings = await this.getUserNotificationSettings(
      input?.userId as number,
    );

    this.logger.log('USER NOTIFICATIONI SETTINGS: ', settings);

    for (const channel of input.channels) {
      switch (channel) {
        case NotificationTypeEnum.IN_APP:
          if (settings?.isInAppTurnedOn) {
            await this._notif.createUserNotification({
              userId: input.userId as number,
              title: input.inapp?.title as string,
              message: input.inapp?.message as string,
              link: input.inapp?.link,
              notificationCategory: input.inapp?.notificationCategory as string,
              icon: input.inapp?.icon,
            });
          }
          break;

        case NotificationTypeEnum.EMAIL:
          if (settings?.isEmailTurnedOn && input.email) {
            await this._emailService.sendTemplateMail({
              template: input.email.template,
              subject: input.email.subject,
              to: input.email.to,
              context: input.email.context,
            });
          }
          break;

        default:
          break;
      }
    }
  }

  private async getUserNotificationSettings(
    userId: number,
  ): Promise<NotificationSettings> {
    if (!userId) {
      throw new BadRequestException('User ID is required for notifications');
    }

    // Later: check Redis cache here
    const settings =
      await this._settingsRepo.findNotificationSettingByUserId(userId);

    const userSettings =
      settings?.responseData?.settings ?? DEFAULT_NOTIFICATION_SETTINGS;

    return userSettings;
  }

  // TODO: Add user notification settings check later
  protected async createMultipleNotifications(
    userIds: number[],
    title: string,
    message: string,
    type: NotificationTypeEnum[],
    // businessId?: string,
    link?: string,
    notificationCategory?: string,
    icon?: string,
  ): Promise<void> {
    const notifications = userIds.map((userId) => ({
      userId,
      // businessId,
      title,
      message,
      notificationType: type,
      link,
      notificationCategory,
      icon,
    })) as unknown as UserNotification[];
    await this._notif.createMultipleUsersNotification(notifications);
  }
}
