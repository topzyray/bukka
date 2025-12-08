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
  ProcessBusinessFeaturedDto,
  ProcessBusinessImportDto,
  ProcessBusinessUpdatedDto,
} from 'src/DomainLayer/Dtos/BusinessNotifictaionHelperDto';
import { AppUrlTypeEnum } from 'src/DomainLayer/Enums/AppUrlTypeEnum';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

@Injectable()
export class BusinessNotificationService extends NotificationService {
  private clientUrl: string;

  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private readonly roleResolver: RoleResolverService,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
    this.clientUrl =
      this.configService.nodeEnv === EnvironmentTypeEnum.DEV
        ? AppUrlTypeEnum.CLIENT_DEV
        : AppUrlTypeEnum.CLIENT_PROD;
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
        link: `${this.clientUrl}/dashboard/admin/businesses/${data.businessId}`,
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

  async processBusinessImported(
    data: ProcessBusinessImportDto,
    category: string,
  ) {
    // notify admin
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.recommenderId,
        title: `New business imported: ${data.businessName}`,
        message: `${data.businessName} was imported successfully!`,
        link: `${this.clientUrl}/dashboard/admin/businesses/${data.businessId}`,
        notificationCategory: category,
      },
      email: {
        template: 'businessImportedAdmin',
        subject: `New business imported ${data.businessName}`,
        to: this.configService.supportEmail,
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

  async processBusinessFeatured(
    data: ProcessBusinessFeaturedDto,
    category: string,
  ) {
    // Get all admin user IDs
    const adminIds = await this.roleResolver.resolveRoleToUserIds(
      UserRoleEnum.ADMIN,
    );

    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: adminIds,
        title: `Business Featured: ${data.businessName}`,
        message: `${data.businessName} has been set as featured.`,
        link: `${this.clientUrl}/dashboard/admin/businesses/${data.businessId}`,
        notificationCategory: category,
      },
      email: {
        template: 'businessFeaturedAdmin',
        subject: `Business Featured: ${data.businessName}`,
        to: this.configService.supportEmail,
        context: data,
      },
    });

    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.ownerId,
        title: 'Your business is now featured!',
        message: `Your business ${data.businessName} has been set as featured.`,
        link: `${this.clientUrl}/dashboard/vendor/businesses/${data.businessId}`,
        notificationCategory: category,
      },
      email: {
        template: 'businessFeaturedOwner',
        subject: `Your business ${data.businessName} is now featured`,
        to: data.ownerEmail,
        context: data,
      },
    });

    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.recommenderId,
        title: 'A business you recommended is now featured!',
        message: `The business ${data.businessName}, which you recommended, has been set as featured.`,
        notificationCategory: category,
      },
      email: {
        template: 'businessFeaturedOwner',
        subject: `Your business ${data.businessName} is now featured`,
        to: data.ownerEmail,
        context: data,
      },
    });
  }
}
