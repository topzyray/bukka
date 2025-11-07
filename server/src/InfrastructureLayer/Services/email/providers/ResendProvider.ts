import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  IEmailProvider,
  MailOptions,
} from 'src/DataLayer/Abstracts/Interfaces/IEmailProvider';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class ResendProvider implements IEmailProvider {
  private readonly logger = new Logger(ResendProvider.name);
  private readonly apiBase = 'https://api.mailjet.com/v3.1/send';

  constructor(private readonly configService: AppConfigurationService) {}

  async sendMail(options: MailOptions) {
    const recipients = Array.isArray(options.to)
      ? options.to.map((email) => ({ Email: email }))
      : [{ Email: options.to }];

    try {
      this.logger.log('Begin sending email via Resend...');

      const response = await axios.post(
        this.apiBase,
        {
          Messages: [
            {
              From: {
                Email: options.from || this.configService.senderEmail,
                Name: this.configService.senderName || 'No-Reply',
              },
              To: recipients,
              Subject: options.subject,
              TextPart: options.text || ' ',
              HTMLPart: options.html,
              Cc: options.cc
                ? Array.isArray(options.cc)
                  ? options.cc.map((email) => ({ Email: email }))
                  : [{ Email: options.cc }]
                : undefined,
              Bcc: options.bcc
                ? Array.isArray(options.bcc)
                  ? options.bcc.map((email) => ({ Email: email }))
                  : [{ Email: options.bcc }]
                : undefined,
              Attachments: options.attachments?.map((att) => ({
                ContentType: att.contentType,
                Filename: att.filename,
                Base64Content:
                  att.content?.toString('base64') || att.path || '',
              })),
            },
          ],
        },
        {
          auth: {
            username: this.configService.mailjetApiKey,
            password: this.configService.mailjetSecretKey,
          },
        },
      );

      this.logger.log(
        `Mailjet email sent to ${recipients.map((r) => r.Email).join(', ')}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error while sending Mailjet email',
        error.response?.data || error,
      );
      throw error;
    }
  }
}
