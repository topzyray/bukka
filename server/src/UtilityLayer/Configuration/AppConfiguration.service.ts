import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AppConfig } from './config.schema';

@Injectable()
export class AppConfigurationService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')?.trim() as string;
  }

  get appUrl(): string {
    return this.configService.get<string>('APP_URL')?.trim() as string;
  }

  get databaseUri(): string {
    return this.configService.get<string>('DATABASE_URL')?.trim() as string;
  }

  get redisUri(): string {
    return this.configService.get<string>('REDIS_URL')?.trim() as string;
  }

  get googleMapApiKey(): string {
    return this.configService
      .get<string>('GOOGLE_MAPS_API_KEY')
      ?.trim() as string;
  }

  get encryptionKey(): string {
    return this.configService.get<string>('ENCRYPTION_KEY')?.trim() as string;
  }

  get encryptionIv(): string {
    return this.configService.get<string>('ENCRYPTION_IV')?.trim() as string;
  }

  get tokenSecret(): string {
    return this.configService.get<string>('TOKEN_SECRET')?.trim() as string;
  }

  get tokenExpiry(): string {
    return this.configService
      .get<string>('TOKEN_EXPIRY_IN_SECONDS')
      ?.trim() as string;
  }

  get maxSessionCount(): number {
    return Number.parseInt(
      this.configService.get<string>('MAX_SESSION_COUNT')?.trim() as string,
      10,
    );
  }

  get accessTokenMaxAge(): number {
    return Number.parseInt(
      this.configService.get<string>('ACCESS_TOKEN_MAX_AGE')?.trim() as string,
      10,
    );
  }

  get refreshTokenMaxAge(): number {
    return Number.parseInt(
      this.configService.get<string>('REFRESH_TOKEN_MAX_AGE')?.trim() as string,
      10,
    );
  }

  get sslKeyPath(): string {
    return this.configService.get<string>('SSL_KEY_PATH')?.trim() as string;
  }

  get sslCertPath(): string {
    return this.configService.get<string>('SSL_CERT_PATH')?.trim() as string;
  }

  get smsProvider(): string {
    return this.configService.get<string>('SMS_PROVIDER')?.trim() as string;
  }

  get emailProvider(): string {
    return this.configService.get<string>('EMAIL_PROVIDER')?.trim() as string;
  }

  get emailHost(): string {
    return this.configService.get<string>('EMAIL_HOST')?.trim() as string;
  }

  get senderEmail(): string {
    return this.configService.get<string>('SENDER_EMAIL')?.trim() as string;
  }

  get senderPassword(): string {
    return this.configService.get<string>('SENDER_PASSWORD')?.trim() as string;
  }

  get emailTemplateEngine(): string {
    return this.configService
      .get<string>('EMAIL_TEMPLATE_ENGINE')
      ?.trim() as string;
  }

  get mailgunApiKey(): string {
    return this.configService.get<string>('MAILGUN_API_KEY')?.trim() as string;
  }

  get mailgunDomain(): string {
    return this.configService.get<string>('MAILGUN_DOMAIN')?.trim() as string;
  }

  get mailjetApiKey(): string {
    return this.configService.get<string>('MAILJET_API_KEY')?.trim() as string;
  }

  get mailjetSecretKey(): string {
    return this.configService
      .get<string>('MAILJET_SECRET_KEY')
      ?.trim() as string;
  }

  get senderName(): string {
    return this.configService.get<string>('SENDER_NAME')?.trim() as string;
  }

  get fileProvider(): string {
    return this.configService.get<string>('FILE_PROVIDER')?.trim() as string;
  }

  get cloudinaryCloudName(): string {
    return this.configService
      .get<string>('CLOUDINARY_CLOUD_NAME')
      ?.trim() as string;
  }

  get cloudinaryApiKey(): string {
    return this.configService
      .get<string>('CLOUDINARY_API_KEY')
      ?.trim() as string;
  }

  get cloudinaryApiSecret(): string {
    return this.configService
      .get<string>('CLOUDINARY_API_SECRET')
      ?.trim() as string;
  }

  get cloudinaryFolder(): string {
    return this.configService
      .get<string>('CLOUDINARY_FOLDER')
      ?.trim() as string;
  }

  get cloudinaryUploadTimeoutMs(): number {
    return Number.parseInt(
      this.configService.get<string>('FILE_UPLOAD_TIMEOUT')?.trim() as string,
      10,
    );
  }

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
}
