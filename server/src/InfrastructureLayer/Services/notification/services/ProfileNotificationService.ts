import { Injectable } from '@nestjs/common';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { UserNotificationRepository } from 'src/BusinessLayer/UserNotificationRepository';
import { EmailService } from '../../email/EmailService';
import { NotificationSettingsRepository } from 'src/BusinessLayer/NotificationSettingsRepository';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import {
  ProcessPasswordChangeDto,
  ProcessProfileOnboardingDto,
  ProcessProfileUpdateDto,
} from 'src/DomainLayer/Dtos/ProfileNotifictaionHelperDto';

@Injectable()
export class ProfileNotificationService extends NotificationService {
  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
  }

  async processPasswordChange(
    data: ProcessPasswordChangeDto,
    category: string,
  ) {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.userId,
        title: 'Password Change',
        message: `Your password was changed successfully. This will take effect on your next signin.`,
        notificationCategory: category,
      },
      email: {
        template: 'passwordChange',
        subject: `Password Change`,
        to: data.email,
        context: {
          ...data,
          link: `${this.configService.supportEmail}/dashboard/${data.role}/settings/account`,
        },
      },
    });
  }

  async processProfileUpdate(data: ProcessProfileUpdateDto, category: string) {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.userId,
        title: 'Profile Update Success',
        message: `Your profile has been updated successfully.`,
        notificationCategory: category,
      },
      email: {
        template: 'profileUpdate',
        subject: `Profile Update Success`,
        to: data.email,
        context: {
          ...data,
          link: `${this.configService.supportEmail}/dashboard/${data.role}/settings/profile`,
        },
      },
    });
  }

  async processOAuthRoleAssignment(
    data: ProcessProfileUpdateDto,
    category: string,
  ) {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.userId,
        title: 'Role Assignment Success',
        message: `Your role has been set successfully.`,
        notificationCategory: category,
      },
      email: {
        template: 'profileUpdate',
        subject: `Role Assignment Success`,
        to: data.email,
        context: {
          ...data,
        },
      },
    });
  }

  async processProfileOnboarding(
    data: ProcessProfileOnboardingDto,
    category: string,
  ) {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.userId,
        title: 'Profile Onboarding Complete',
        message: `Your profile onboarding is completed. Welcome to Bukka.`,
        notificationCategory: category,
      },
      email: {
        template: 'profileOnboarding',
        subject: `Profile Onboarding Complete`,
        to: data.email,
        context: {
          ...data,
          link: `${this.configService.supportEmail}/dashboard/${data.role}/overview`,
        },
      },
    });
  }
}
