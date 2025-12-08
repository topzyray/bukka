import { Injectable } from '@nestjs/common';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { RoleResolverService } from '../../RoleResolverService';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { EmailService } from '../../email/EmailService';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import {
  ProcessNewRecommendationDto,
  ProcessRecommendationApprovalDto,
  ProcessRecommendationDeletionDto,
  ProcessRecommendationRejectionDto,
} from 'src/DomainLayer/Dtos/RecommendationNotifictaionHelperDto';
import { AppUrlTypeEnum } from 'src/DomainLayer/Enums/AppUrlTypeEnum';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

@Injectable()
export class RecommendationNotificationService extends NotificationService {
  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private readonly roleResolver: RoleResolverService,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
  }

  async processNewRecommendation(
    data: ProcessNewRecommendationDto,
    category: string,
  ) {
    // Notify admins via email and in-app
    // notify admins (resolve admin ids)
    const adminIds = await this.roleResolver.resolveRoleToUserIds(
      UserRoleEnum.ADMIN,
    );
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: adminIds.length ? adminIds : [],
        title: 'New Recommendation Received',
        message: `${data.recommenderName ?? 'A user'} recommended ${data.businessName ?? 'a business'}`,
        notificationCategory: category,
        link: `${this.configService.nodeEnv === EnvironmentTypeEnum.DEV ? AppUrlTypeEnum.CLIENT_DEV : AppUrlTypeEnum.CLIENT_PROD}/dashboard/admin/recommendations/${data.recommendationId}`,
      },
      email: {
        template: 'newRecommendationAdmin',
        subject: 'New Recommendation submitted',
        to: this.configService.supportEmail,
        context: data,
      },
    });

    // Notifiy to
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.recommenderId,
        title: 'Recommendation submitted',
        message: `Your recommendation for ${data.businessName} has been received. Thank you for supporting the community of food lovers!`,
        notificationCategory: category,
      },
      email: {
        template: 'recommendationReceived',
        subject: 'We received your recommendation',
        to: data.recommenderEmail,
        context: data,
      },
    });
  }

  async processRecommendationApproval(
    data: ProcessRecommendationApprovalDto,
    category: string,
  ) {
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.recommenderId,
        title: 'Recommendation approved',
        message: `Your recommendation for ${data.businessName} was approved.`,
        notificationCategory: category,
      },
      email: {
        template: 'recommendationApproved',
        subject: 'Recommendation approved',
        to: data.recommenderEmail,
        context: data,
      },
    });
  }

  async processRecommendationRejection(
    data: ProcessRecommendationRejectionDto,
    category: string,
  ) {
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.recommenderId,
        title: 'Recommendation Deletion',
        message: `Your recommendation ${data.businessName} was not approved.`,
        notificationCategory: category,
      },
      email: {
        template: 'recommendationRejected',
        subject: 'Recommendation not approved',
        to: data.recommenderEmail,
        context: data,
      },
    });
  }

  async processRecommendationDeletion(
    data: ProcessRecommendationDeletionDto,
    category: string,
  ) {
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.recommenderId,
        title: 'Recommendation Deletion',
        message: `Your recommendation ${data.businessName} was not deleted successfully.`,
        notificationCategory: category,
      },
      email: {
        template: 'recommendationDeleted',
        subject: 'Recommendation deleted',
        to: data.recommenderEmail,
        context: data,
      },
    });
  }
}
