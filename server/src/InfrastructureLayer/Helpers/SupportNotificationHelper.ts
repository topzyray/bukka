import { Injectable } from '@nestjs/common';
import {
  ProcessAssignedTicketDto,
  ProcessNewTicketDto,
  ProcessResolvedTicketDto,
} from 'src/DomainLayer/Dtos/SupportNotifictaionHelperDto';
import { SupportNotificationService } from '../Services/notification/services/SupportNotificationService';

@Injectable()
export class SupportNotificationHelper {
  constructor(private readonly svc: SupportNotificationService) {}

  async processNewTicket(data: ProcessNewTicketDto, category: string) {
    await this.svc.processNewTicket(data, category);
  }

  async processAssigned(data: ProcessAssignedTicketDto, category: string) {
    await this.svc.processAssigned(data, category);
  }

  async processResolved(data: ProcessResolvedTicketDto, category: string) {
    await this.svc.processResolved(data, category);
  }
}
