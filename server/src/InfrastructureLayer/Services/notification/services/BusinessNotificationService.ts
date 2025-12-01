import { Injectable } from '@nestjs/common';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { EmailService } from '../../email/EmailService';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import { RoleResolverService } from '../../RoleResolverService';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import {
  ProcessBusinessCreationDto,
  ProcessBusinessDeletedDto,
  ProcessBusinessUpdatedDto,
} from 'src/DomainLayer/Dtos/BusinessNotifictaionHelperDto';

@Injectable()
export class BusinessNotificationService extends NotificationService {
  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private readonly roleResolver: RoleResolverService,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
  }

  async processBusinessCreated(
    data: ProcessBusinessCreationDto,
    category: string,
  ) {
    const opsIds = await this.roleResolver.resolveRoleToUserIds(
      UserRoleEnum.ADMIN,
    ); // TODO: ADD OPERATIONS AGENT ROLE IN THE FUTURE

    // notify ops
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: opsIds,
        title: `New business registered: ${data.businessName}`,
        message: `New business created by user with ID ${data.ownerId}`,
        link: `${this.configService.appUrl}/dashboard/admin/businesses/${data.businessId}`,
        notificationCategory: category,
      },
      email: {
        template: 'businessCreatedAdmin',
        subject: `New business registered ${data.businessName}`,
        to: this.configService.supportEmail,
        context: data,
      },
    });

    // notify owner
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.ownerId,
        title: 'Business created',
        message: `Your business ${data.businessName} was created.`,
        notificationCategory: category,
      },
      email: {
        template: 'businessCreatedOwner',
        subject: `Your business ${data.businessName} was created`,
        to: data.ownerEmail,
        context: data,
      },
    });
  }

  async processBusinessUpdated(
    data: ProcessBusinessUpdatedDto,
    category: string,
  ) {
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.ownerId,
        title: `Business updated: ${data.businessName}`,
        message: `Your business details were updated.`,
        notificationCategory: category,
      },
      email: {
        template: 'businessUpdatedOwner',
        subject: `Your business ${data.businessName} was updated`,
        to: data.ownerEmail,
        context: data,
      },
    });
  }

  async processBusinessDeleted(
    data: ProcessBusinessDeletedDto,
    category: string,
  ) {
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.ownerId,
        title: `Business deleted: ${data.businessName}`,
        message: `Your business ${data.businessName} was deleted successfully.`,
        notificationCategory: category,
      },
      email: {
        template: 'businessUpdatedOwner',
        subject: `Your business ${data.businessName} was deleted successfully.`,
        to: data.ownerEmail,
        context: data,
      },
    });
  }
}
