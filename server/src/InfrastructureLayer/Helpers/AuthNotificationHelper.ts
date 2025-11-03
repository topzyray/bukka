import { Injectable } from '@nestjs/common';
import {
  processAccountConfirmationDto,
  processPasswordResetDto,
  ProcessReferralSignupDto,
  processResendConfirmationDto,
  ProcessSignupDto,
} from 'src/DomainLayer/Dtos/AuthNotificationHelperDto';
import { AuthNotificationService } from '../Services/notification/services/AuthNotificationService';

@Injectable()
export class AuthNotificationHelper {
  constructor(private readonly _notificationService: AuthNotificationService) {}

  async processAccountConfirmation(
    data: processAccountConfirmationDto,
    category: string,
  ) {
    await this._notificationService.processAccountConfirmation(data, category);
  }

  async processForgotPassword(data: processPasswordResetDto, category: string) {
    await this._notificationService.processPasswordReset(data, category);
  }

  async processSignup(data: ProcessSignupDto, category: string) {
    await this._notificationService.processSignupWelcome(data, category);
  }

  async processResendConfirmation(
    data: processResendConfirmationDto,
    category: string,
  ) {
    await this._notificationService.processResendConfirmation(data, category);
  }

  async processReferralSignup(
    data: ProcessReferralSignupDto,
    category: string,
  ) {
    await this._notificationService.processReferralSignup(data, category);
  }
}
