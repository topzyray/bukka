import { Injectable } from '@nestjs/common';
import {
  ProcessPasswordChangeDto,
  ProcessProfileOnboardingDto,
  ProcessProfileUpdateDto,
} from 'src/DomainLayer/Dtos/ProfileNotifictaionHelperDto';
import { ProfileNotificationService } from '../Services/notification/services/ProfileNotificationService';

@Injectable()
export class ProfileNotificationHelper {
  constructor(private readonly svc: ProfileNotificationService) {}

  async processPasswordChange(
    data: ProcessPasswordChangeDto,
    category: string,
  ) {
    await this.svc.processPasswordChange(data, category);
  }

  async processProfileOnboarding(
    data: ProcessProfileOnboardingDto,
    category: string,
  ) {
    await this.svc.processProfileOnboarding(data, category);
  }

  async processProfileUpdate(data: ProcessProfileUpdateDto, category: string) {
    await this.svc.processProfileUpdate(data, category);
  }
}
