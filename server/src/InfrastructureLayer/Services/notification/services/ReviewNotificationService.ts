import { Injectable } from '@nestjs/common';
import { EmailService } from '../../email/EmailService';
import { NotificationService } from '../NotificationService';
import { RoleResolverService } from '../../RoleResolverService';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { ProcessNewReviewDto } from 'src/DomainLayer/Dtos/ReviewNotifictaionHelperDto';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';

@Injectable()
export class ReviewNotificationService extends NotificationService {
  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private roleResolver: RoleResolverService,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
  }

  async processNewReview(
    data: ProcessNewReviewDto,
    category: string,
  ): Promise<void> {
    const adminIds = await this.roleResolver.resolveRoleToUserIds(
      UserRoleEnum.ADMIN,
    );

    const sendReviewNotification = async ({
      userId,
      emailTo,
      title,
      message,
      template,
      link,
      channels,
    }: {
      userId: number | number[];
      emailTo: string;
      title: string;
      message: string;
      template: string;
      link: string;
      channels: NotificationTypeEnum[];
    }) =>
      // TODO: ADD EMAIL AND PUSH CHANNELS
      this.dispatchNotification({
        channels: channels,
        inapp: {
          userId,
          title,
          message,
          link,
          notificationCategory: category,
        },
        email: {
          template,
          subject: title,
          to: emailTo,
          context: data,
        },
      });

    // Notify Admins
    await sendReviewNotification({
      channels: [NotificationTypeEnum.IN_APP],
      userId: adminIds,
      emailTo: this.configService.supportEmail,
      title: `New Review for ${data.businessName}`,
      message: `${TextHelper.capitalize(data.reviewerFirstName)} left a ${data.rating}-star review.`,
      template: 'reviewCreatedAdmin',
      link: data.businessReviewedLink,
    });

    // Notify Vendor
    await sendReviewNotification({
      channels: [NotificationTypeEnum.IN_APP],
      userId: data.vendorId,
      emailTo: data.vendorEmail,
      title: `Your Business Received a New Review`,
      message: `${TextHelper.capitalize(data.reviewerFirstName)} rated you ${data.rating} stars.`,
      template: 'reviewCreatedVendor',
      link: data.businessReviewedLink,
    });

    // Notify Reviewer
    await sendReviewNotification({
      channels: [NotificationTypeEnum.IN_APP],
      userId: data.reviewerId,
      emailTo: data.reviewerEmail,
      title: `Your Review Was Submitted`,
      message: `Thanks for reviewing ${data.businessName}.`,
      template: 'reviewCreatedReviewer',
      link: data.userReviewLink,
    });
  }
}
