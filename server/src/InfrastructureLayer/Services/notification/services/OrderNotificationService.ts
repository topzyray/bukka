import { Injectable } from '@nestjs/common';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { EmailService } from '../../email/EmailService';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import { RoleResolverService } from '../../RoleResolverService';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import {
  ProcessOrderCreatedDto,
  ProcessOrderStatusDto,
} from 'src/DomainLayer/Dtos/OrderNotifictaionHelperDto';

@Injectable()
export class OrderNotificationService extends NotificationService {
  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private roleResolver: RoleResolverService,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
  }

  async processOrderCreated(data: ProcessOrderCreatedDto, category: string) {
    // Notify admins via email and in-app
    // notify admins (resolve admin ids)
    const adminIds = await this.roleResolver.resolveRoleToUserIds(
      UserRoleEnum.ADMIN,
    );

    // Notify Admin
    // TODO: ADD EMAIL AND PUSH CHANNELS
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: adminIds,
        title: `New order #${data.orderId}`,
        message: `A new order was placed (₦${data.totalAmount}).`,
        link: `${this.configService.appUrl}/dashboard/admin/orders/${data.orderId}`,
        notificationCategory: category,
      },
      email: {
        template: 'orderCreatedAdmin',
        subject: `New order ${data.orderId}`,
        to: this.configService.supportEmail,
        context: data,
      },
    });

    // TODO: ALSO NOTIFY ALL RIDERS AVAILABLE

    // notify vendor/business
    // TODO: ADD EMAIL AND PUSH CHANNELS
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.vendorId,
        title: `New order #${data.orderId}`,
        message: `A new order was placed (₦${data.totalAmount}).`,
        link: `${this.configService.appUrl}/dashboard/vendor/orders/${data.orderId}`,
        notificationCategory: category,
      },
      email: {
        template: 'orderCreatedVendor',
        subject: `New order ${data.orderId}`,
        to: data.vendorEmail,
        context: data,
      },
    });

    // notify customer
    // TODO: ADD EMAIL AND PUSH CHANNELS
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.customerId,
        title: `Order placed #${data.orderId}`,
        message: `Your order is received and being processed.`,
        link: `${this.configService.appUrl}/dashboard/${data.customerRole.toLowerCase()}/orders/${data.orderId}`,
        notificationCategory: category,
      },
      email: {
        template: 'orderCreatedCustomer',
        subject: `Your order ${data.orderId} is placed`,
        to: data.customerEmail ?? '',
        context: data,
      },
    });
  }

  async processOrderStatusUpdate(
    data: ProcessOrderStatusDto,
    category: string,
  ) {
    // notify customer only for status updates
    // TODO: ADD EMAIL AND PUSH CHANNELS
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.customerId,
        title: `Order ${data.orderId} -s status: ${data.status}`,
        message: `Your order is now ${data.status}.`,
        link: `${this.configService.appUrl}/dashboard/${data.customerRole.toLowerCase()}/orders/${data.orderId}`,
        notificationCategory: category,
      },
      email: {
        template: 'orderStatusUpdate',
        subject: `Order ${data.orderId} is now ${data.status}`,
        to: data.customerEmail ?? '',
        context: data,
      },
    });
  }
}
