import { Injectable } from '@nestjs/common';
import { EmailProviderEnum } from 'src/DomainLayer/Enums/EmailProviderEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { NodemailerProvider } from './providers/NodemailerProvider';
import {
  IEmailProvider,
  MailOptions,
} from 'src/DataLayer/Abstracts/Interfaces/IEmailProvider';

@Injectable()
export class EmailFactory {
  constructor(
    private readonly nodemailerProvider: NodemailerProvider,
    private readonly configService: AppConfigurationService,
  ) {}

  getProvider(options?: MailOptions): IEmailProvider {
    const provider = this.configService.emailProvider;

    switch (provider) {
      case EmailProviderEnum.NODEMAILER:
        return this.nodemailerProvider;
      default:
        throw new Error('Invalid or Missing Email Provider');
    }
  }
}
