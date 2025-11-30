import { Injectable } from '@nestjs/common';
import { NotificationService } from '../NotificationService';
import { NotificationTypeEnum } from 'src/DomainLayer/Enums/NotificationTypeEnum';

@Injectable()
export class SupportNotificationService extends NotificationService {
  async processNewTicketConfirmation(
    data: any, // Change to DTO later
    _category: string,
  ): Promise<void> {
    await this.dispatchNotification({
      channels: [NotificationTypeEnum.EMAIL, NotificationTypeEnum.IN_APP],
      email: {
        template: 'newTicketConfirmation',
        subject: 'New Ticket Confirmation',
        to: data.email,
        context: {
          firstName: data.firstName,
        },
      },
    });
  }
}
