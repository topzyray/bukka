import { Injectable } from '@nestjs/common';
import { EmailFactory } from './EmailFactory';
import { EmailTemplateFactory } from './EmailTemplateFactory';
import { MailOptions } from 'src/DataLayer/Abstracts/Interfaces/IEmailProvider';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailFactory: EmailFactory,
    private readonly templateFactory: EmailTemplateFactory,
  ) {}

  async sendMail(options: MailOptions) {
    const provider = this.emailFactory.getProvider(options);
    return provider.sendMail(options);
  }

  async sendTemplateMail<T extends Record<string, unknown>>(payload: {
    to: string | string[];
    subject: string;
    template: string;
    context: T;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: MailOptions['attachments'];
  }) {
    const engine = this.templateFactory.getEngine();
    const html = await engine.render(payload.template, payload.context);
    const options: MailOptions = {
      to: payload.to,
      subject: payload.subject,
      html,
      from: payload.from,
      cc: payload?.cc,
      bcc: payload?.bcc,
      attachments: payload?.attachments,
    };
    return this.emailFactory.getProvider().sendMail(options);
  }
}
