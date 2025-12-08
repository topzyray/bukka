import { Injectable } from '@nestjs/common';
import {
  ProcessBusinessCreationDto,
  ProcessBusinessDeletedDto,
  ProcessBusinessFeaturedDto,
  ProcessBusinessImportDto,
  ProcessBusinessUpdatedDto,
} from 'src/DomainLayer/Dtos/BusinessNotifictaionHelperDto';
import { BusinessNotificationService } from '../Services/notification/services/BusinessNotificationService';

@Injectable()
export class BusinessNotificationHelper {
  constructor(private readonly svc: BusinessNotificationService) {}

  async processCreated(data: ProcessBusinessCreationDto, category: string) {
    await this.svc.processBusinessCreated(data, category);
  }

  async processFeatured(data: ProcessBusinessFeaturedDto, category: string) {
    await this.svc.processBusinessFeatured(data, category);
  }

  async processImported(data: ProcessBusinessImportDto, category: string) {
    await this.svc.processBusinessImported(data, category);
  }

  async processUpdated(data: ProcessBusinessUpdatedDto, category: string) {
    await this.svc.processBusinessUpdated(data, category);
  }

  async processDeleted(data: ProcessBusinessDeletedDto, category: string) {
    await this.svc.processBusinessDeleted(data, category);
  }
}
