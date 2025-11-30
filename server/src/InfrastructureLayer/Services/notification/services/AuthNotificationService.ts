import { Injectable } from '@nestjs/common';
import {
  processAccountConfirmationDto,
  processPasswordResetDto,
  ProcessReferralSignupDto,
  processResendConfirmationDto,
  ProcessSignupDto,
} from 'src/DomainLayer/Dtos/AuthNotificationHelperDto';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';

@Injectable()
export class AuthNotificationService extends NotificationService {
  async processAccountConfirmation(
    data: processAccountConfirmationDto,
    _category: string,
  ): Promise<void> {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.EMAIL],
      email: {
        template: 'confirmEmail',
        subject: 'Confirm Your Email Address',
        to: data.email,
        context: {
          firstName: data.firstName,
          confirmationCode: data.confirmationCode,
          confirmationCodeExpires: data.confirmationCodeExpires,
        },
      },
    });
  }

  async processPasswordReset(
    data: processPasswordResetDto,
    category: string,
  ): Promise<void> {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.EMAIL],
      inapp: {
        userId: data.userId,
        title: 'Confirm Your Email',
        message: 'Welcome to Bukka!',
        notificationCategory: category,
      },
      email: {
        template: 'passwordReset',
        subject: 'Your password reset token (valid for only 10minutes)',
        to: data.email,
        context: {
          firstName: data.firstName,
          passwordResetToken: data.passwordResetToken,
          passwordResetExpires: data.passwordResetExpires,
        },
      },
    });
  }

  async processSignupWelcome(
    data: ProcessSignupDto,
    category: string,
  ): Promise<void> {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.EMAIL, NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.userId,
        title: 'Congratulations',
        message:
          'Welcome to Bukka! We are glad to have you onboard! You can recommend a business',
        notificationCategory: category,
      },
      email: {
        template: 'welcome',
        subject: 'Welcome to Bukka!',
        to: data.email,
        context: {
          firstName: data.firstName,
          getStartedLink: data.getStartedLink,
        },
      },
    });
  }

  async processResendConfirmation(
    data: processResendConfirmationDto,
    _category: string,
  ): Promise<void> {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.EMAIL],
      email: {
        template: 'confirmEmail',
        subject: 'New Email Confirmation Request',
        to: data.email,
        context: {
          firstName: data.firstName,
          confirmationCode: data.confirmationCode,
          confirmationCodeExpires: data.confirmationCodeExpires,
        },
      },
    });
  }

  async processReferralSignup(
    data: ProcessReferralSignupDto,
    _category: string,
  ): Promise<void> {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.EMAIL],
      email: {
        template: 'referralSignup',
        subject: 'Referral Signup!',
        to: data.email,
        context: {
          email: data.email,
          firstName: data.firstName,
          defaultPassword: data.defaultPassword,
          referrerCode: data.referrerCode,
        },
      },
    });
  }
}
