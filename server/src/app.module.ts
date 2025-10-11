import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './UtilityLayer/Configuration/Database.module';
import { AppConfigurationModule } from './UtilityLayer/Configuration/AppConfiguration.module';
import { RestaurantSearchService } from './InfrastructureLayer/Services/RestaurantSearchService';
import { AppConfigurationService } from './UtilityLayer/Configuration/AppConfiguration.service';
import { DbAdapterEnum } from './DomainLayer/Enums/DbAdapterEnum';
import { HttpServiceWrapper } from './InfrastructureLayer/Services/HttpServiceWrapper';
import { AuthController } from './ServiceLayer/Controllers/AuthController';
import { UserController } from './ServiceLayer/Controllers/UserController';
import { UserNotificationController } from './ServiceLayer/Controllers/UserNotificationController';
import { NotificationSettingsController } from './ServiceLayer/Controllers/NotificationSettingsController';
import { HandlebarsEngine } from './InfrastructureLayer/Services/email/template-engine/HandleBarsEngine';
import { ManualTemplateEngine } from './InfrastructureLayer/Services/email/template-engine/ManualEngine';
import { AuthNotificationHelper } from './InfrastructureLayer/Helpers/AuthNotificationHelper';
import { NotificationSettingsDataAgent } from './DataLayer/DataAgents/NotificationSettingsDataAgent';
import { UserNotificationDataAgent } from './DataLayer/DataAgents/UserNotificationDataAgent';
import { NotificationSettingsRepository } from './BussinessLayer/NotificationSettingsRepository';
import { UserNotificationRepository } from './BussinessLayer/UserNotificationRepository';
import { AuthRepository } from './BussinessLayer/AuthRepository';
import { UserDataAgent } from './DataLayer/DataAgents/UserDataAgent';
import { EmailTemplateFactory } from './InfrastructureLayer/Services/email/EmailTemplateFactory';
import { EmailFactory } from './InfrastructureLayer/Services/email/EmailFactory';
import { NotificationService } from './InfrastructureLayer/Services/notification/NotificationService';
import { AuthNotificationService } from './InfrastructureLayer/Services/notification/auth/AuthNotificationService';
import { EmailService } from './InfrastructureLayer/Services/email/EmailService';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NodemailerProvider } from './InfrastructureLayer/Services/email/providers/NodemailerProvider';
import { TokenRepository } from './BussinessLayer/TokenRepository';
import { UserRepository } from './BussinessLayer/UserRepository';
import { JwtService } from '@nestjs/jwt';
import { HealthController } from './ServiceLayer/Controllers/HealthController';
import { WaitListController } from './ServiceLayer/Controllers/WaitListController';
import { WaitlistRepository } from './BussinessLayer/WaitlistRepository';
import { WaitlistDataAgent } from './DataLayer/DataAgents/WaitlistDataAgent';
import { MailjetProvider } from './InfrastructureLayer/Services/email/providers/MailjetProvider';
import { MailgunProvider } from './InfrastructureLayer/Services/email/providers/MailgunProvider';
import { FileDataAgent } from './DataLayer/DataAgents/FileDataAgent';
import { FileRepository } from './BussinessLayer/FileRepository';
import { FileController } from './ServiceLayer/Controllers/FileController';
import { FileReferenceHelper } from './InfrastructureLayer/Helpers/FileReferenceHelper';
import { FileUploadService } from './InfrastructureLayer/Services/upload/FileUploadService';
import { FileFactory } from './InfrastructureLayer/Services/upload/FileFactory';
import { LocalDiskProvider } from './InfrastructureLayer/Services/upload/providers/LocalDiskProvider';
import { CloudinaryProvider } from './InfrastructureLayer/Services/upload/providers/CloudinaryProvider';
import { ScheduleModule } from '@nestjs/schedule';
import { KeepAliveService } from './InfrastructureLayer/Services/KeepAliveService';
import { UserPersonalizationController } from './ServiceLayer/Controllers/UserPersonalizationController';
import { UserPersonalizationRepository } from './BussinessLayer/UserPersonalizationRepository';
import { UserPersonalizationDataAgent } from './DataLayer/DataAgents/UserPersonalizationDataAgent';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TerminusModule,
    AppConfigurationModule,
    DatabaseModule.forRoot({ adapter: DbAdapterEnum.PRISMA }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    HealthController,
    AuthController,
    WaitListController,
    FileController,
    UserController,
    UserNotificationController,
    NotificationSettingsController,
    UserPersonalizationController,
  ],
  providers: [
    AppService,
    AppConfigurationService,
    RestaurantSearchService,
    JwtService,
    EmailService,
    FileUploadService,
    KeepAliveService,

    AuthNotificationService,
    NotificationService,

    EmailFactory,
    EmailTemplateFactory,
    FileFactory,

    WaitlistRepository,
    AuthRepository,
    NotificationSettingsRepository,
    UserNotificationRepository,
    TokenRepository,
    UserRepository,
    FileRepository,
    UserPersonalizationRepository,

    WaitlistDataAgent,
    NotificationSettingsDataAgent,
    UserNotificationDataAgent,
    UserDataAgent,
    FileDataAgent,
    UserPersonalizationDataAgent,

    AuthNotificationHelper,
    FileReferenceHelper,

    NodemailerProvider,
    MailjetProvider,
    MailgunProvider,
    LocalDiskProvider,
    CloudinaryProvider,

    HttpServiceWrapper,
    HandlebarsEngine,
    ManualTemplateEngine,
    Logger,
  ],
})
export class AppModule {}
