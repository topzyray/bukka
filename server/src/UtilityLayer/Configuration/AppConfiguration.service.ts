import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AppConfig } from './config.schema';

@Injectable()
export class AppConfigurationService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')?.trim() as string;
  }

  get pgUri(): string {
    return this.configService.get<string>('DATABASE_URL')?.trim() as string;
  }

  get googleMapApiKey(): string {
    return this.configService
      .get<string>('GOOGLE_MAPS_API_KEY')
      ?.trim() as string;
  }

  // get port(): string {
  //   return this.configService.get<string>('PORT')?.trim() as string;
  // }

  // get azureServiceBusConnString(): string {
  //   return this.configService
  //     .get<string>('AZURE_SERVICE_BUS_CONNECTION_STRING')
  //     ?.trim() as string;
  // }

  // get azureCommunicationString(): string {
  //   return this.configService
  //     .get<string>('AZURE_COMMUNICATION_CONNECTION_STRING')
  //     ?.trim() as string;
  // }

  // get sslKeyPath(): string {
  //   return this.configService.get<string>('SSL_KEY_PATH')?.trim() as string;
  // }

  // get sslCertPath(): string {
  //   return this.configService.get<string>('SSL_CERT_PATH')?.trim() as string;
  // }

  // get smsProvider(): string {
  //   return this.configService.get<string>('SMS_PROVIDER')?.trim() as string;
  // }

  // get emailProvider(): string {
  //   return this.configService.get<string>('EMAIL_PROVIDER')?.trim() as string;
  // }

  // get senderEmail(): string {
  //   return this.configService.get<string>('SENDER_EMAIL')?.trim() as string;
  // }

  // get emailTemplateEngine(): string {
  //   return this.configService
  //     .get<string>('EMAIL_TEMPLATE_ENGINE')
  //     ?.trim() as string;
  // }

  // get fileProvider(): string {
  //   return this.configService.get<string>('FILE_PROVIDER')?.trim() as string;
  // }

  // get queueProvider(): string {
  //   return this.configService.get<string>('QUEUE_PROVIDER')?.trim() as string;
  // }

  // get storageContainerName(): string {
  //   return this.configService
  //     .get<string>('STORAGE_CONTAINER_NAME')
  //     ?.trim() as string;
  // }

  // get storageConnectionString(): string {
  //   return this.configService
  //     .get<string>('AZURE_STORAGE_CONN_STRING')
  //     ?.trim() as string;
  // }

  // get storageAccountName(): string {
  //   return this.configService
  //     .get<string>('AZUAZURE_STORAGE_ACCOUNT_NAME')
  //     ?.trim() as string;
  // }

  // get storageAccountKey(): string {
  //   return this.configService
  //     .get<string>('AZURE_STORAGE_ACCOUNT_KEY')
  //     ?.trim() as string;
  // }

  // get owoDocumentUrl(): string {
  //   return this.configService.get<string>('OWO_DOCUMENT_URL')?.trim() as string;
  // }
}
