import { Injectable } from '@nestjs/common';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { RoleResolverService } from '../../RoleResolverService';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { EmailService } from '../../email/EmailService';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import {
  ProcessAssignedTicketDto,
  ProcessNewTicketDto,
  ProcessResolvedTicketDto,
} from 'src/DomainLayer/Dtos/SupportNotifictaionHelperDto';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class SupportNotificationService extends NotificationService {
  constructor(
    _notif: UserNotificationRepository,
    _emailService: EmailService,
    _settingsRepo: NotificationSettingsRepository,
    private roleResolver: RoleResolverService,
    private readonly configService: AppConfigurationService,
  ) {
    super(_notif, _emailService, _settingsRepo);
  }

  async processNewTicket(data: ProcessNewTicketDto, category: string) {
    const supportAgentIds = await this.roleResolver.resolveRoleToUserIds(
      UserRoleEnum.ADMIN,
    ); // TODO: ADD SUPPORT AGENT ROLE IN THE FUTURE

    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: supportAgentIds,
        title: `New support ticket: ${data.subject}`,
        message: data.message,
        link: `/support/${data.ticketId}`,
        notificationCategory: category,
      },
      email: {
        template: 'supportNewTicketAgent',
        subject: `New support ticket ${data.ticketId}`,
        to: this.configService.supportEmail,
        context: data,
      },
    });

    // confirmation to creator
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.creatorId,
        title: 'Support request received',
        message: `We received your request with ID: ${data.ticketId}`,
        notificationCategory: category,
      },
      email: {
        template: 'supportTicketCreatedUser',
        subject: `We received your ticket ${data.ticketId}`,
        to: data.creatorEmail,
        context: data,
      },
    });
  }

  async processAssigned(data: ProcessAssignedTicketDto, category: string) {
    // Notify Assignee
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.assigneeId,
        title: `Ticket assigned: ${data.ticketId}`,
        message: `You were assigned ticket ${data.ticketId}`,
        notificationCategory: category,
      },
      email: {
        template: 'supportAssigned',
        subject: `Ticket assigned ${data.ticketId}`,
        to: data.assigneeEmail,
        context: data,
      },
    });

    // Notify Creator
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.creatorId,
        title: `Ticket assigned: ${data.ticketId}`,
        message: `Your ticket with ID ${data.ticketId} has been assigned to our team.`,
        notificationCategory: category,
      },
      email: {
        template: 'supportAssigned',
        subject: `Ticket assigned ${data.ticketId}`,
        to: data.creatorEmail,
        context: data,
      },
    });
  }

  async processResolved(data: ProcessResolvedTicketDto, category: string) {
    // TODO: ADD EMAIL CHANNEL
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.IN_APP],
      inapp: {
        userId: data.creatorId,
        title: `Ticket resolved: ${data.ticketId}`,
        message: `Your ticket with ID ${data.ticketId} has been resolved.`,
        notificationCategory: category,
      },
      email: {
        template: 'supportResolved',
        subject: `Ticket resolved ${data.ticketId}`,
        to: data.creatorEmail,
        context: data,
      },
    });
  }
}
