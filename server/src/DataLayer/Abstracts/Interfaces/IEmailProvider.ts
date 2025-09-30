export interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: {
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
    cid?: string;
  }[];
}

export interface IEmailProvider {
  sendMail(options: MailOptions): Promise<any>;
}
