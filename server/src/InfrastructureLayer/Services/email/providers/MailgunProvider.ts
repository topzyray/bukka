import { Injectable, Logger } from '@nestjs/common';
import FormData from 'form-data';
import axios from 'axios';
import {
  IEmailProvider,
  MailOptions,
} from 'src/DataLayer/Abstracts/Interfaces/IEmailProvider';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class MailgunProvider implements IEmailProvider {
  private readonly logger = new Logger(MailgunProvider.name);

  constructor(private readonly configService: AppConfigurationService) {}

  async sendMail(options: MailOptions) {
    const domain = this.configService.mailgunDomain;
    const baseUrl = `https://api.mailgun.net/v3/${domain}/messages`;

    const form = new FormData();
    form.append('from', options.from || this.configService.senderEmail);
    form.append(
      'to',
      Array.isArray(options.to) ? options.to.join(',') : options.to,
    );
    if (options.cc)
      form.append(
        'cc',
        Array.isArray(options.cc) ? options.cc.join(',') : options.cc,
      );
    if (options.bcc)
      form.append(
        'bcc',
        Array.isArray(options.bcc) ? options.bcc.join(',') : options.bcc,
      );
    form.append('subject', options.subject);
    form.append('text', options.text || '');
    form.append('html', options.html);

    if (options.attachments) {
      for (const att of options.attachments) {
        if (att.path) form.append('attachment', att.path);
        else if (att.content)
          form.append('attachment', att.content, att.filename);
      }
    }

    try {
      this.logger.log('Begin sending email via Mailgun...');

      const response = await axios.post(baseUrl, form, {
        auth: {
          username: 'api',
          password: this.configService.mailgunApiKey,
        },
        headers: form.getHeaders(),
      });

      this.logger.log(`Mailgun email sent to ${options.to}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error while sending Mailgun email',
        error.response?.data || error,
      );
      throw error;
    }
  }
}
