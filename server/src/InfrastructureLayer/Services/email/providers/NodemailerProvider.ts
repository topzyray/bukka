import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import {
  IEmailProvider,
  MailOptions,
} from 'src/DataLayer/Abstracts/Interfaces/IEmailProvider';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class NodemailerProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(NodemailerProvider.name);

  constructor(private readonly configService: AppConfigurationService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.emailHost,
      auth: {
        user: this.configService.senderEmail,
        pass: this.configService.senderPassword,
      },
    });
  }

  async sendMail(options: MailOptions) {
    const recipients = Array.isArray(options.to)
      ? options.to.join(', ')
      : options.to;
    const cc = options.cc
      ? Array.isArray(options.cc)
        ? options.cc.join(', ')
        : options.cc
      : undefined;
    const bcc = options.bcc
      ? Array.isArray(options.bcc)
        ? options.bcc.join(', ')
        : options.bcc
      : undefined;

    const text = htmlToText(options.html);

    try {
      this.logger.log('Begin sending email...');

      const result = await this.transporter.sendMail({
        from: options.from || this.configService.senderEmail,
        to: recipients,
        cc,
        bcc,
        subject: options.subject,
        text,
        html: options.html,
        attachments: options.attachments,
      });

      this.logger.log(`Email successfully sent to ${recipients}`);
      return result;
    } catch (error) {
      this.logger.error('Error while sending email', error.stack || error);
      throw error;
    }
  }
}
