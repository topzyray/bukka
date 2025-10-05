import { Injectable } from '@nestjs/common';
import { EmailProviderEnum } from 'src/DomainLayer/Enums/EmailProviderEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { NodemailerProvider } from './providers/NodemailerProvider';
import {
  IEmailProvider,
  MailOptions,
} from 'src/DataLayer/Abstracts/Interfaces/IEmailProvider';
import { MailjetProvider } from './providers/MailjetProvider';
import { MailgunProvider } from './providers/MailgunProvider';

@Injectable()
export class EmailFactory {
  constructor(
    private readonly nodemailerProvider: NodemailerProvider,
    private readonly mailjetProvider: MailjetProvider,
    private readonly mailgunProvider: MailgunProvider,
    private readonly configService: AppConfigurationService,
  ) {}

  getProvider(options?: MailOptions): IEmailProvider {
    const provider = this.configService.emailProvider;

    switch (provider) {
      case EmailProviderEnum.NODEMAILER:
        return this.nodemailerProvider;
      case EmailProviderEnum.MAILJET:
        return this.mailjetProvider;
      case EmailProviderEnum.MAILGUN:
        return this.mailgunProvider;
      default:
        throw new Error('Invalid or Missing Email Provider');
    }
  }
}
