// CORE
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// MODULES
import { DatabaseModule } from './UtilityLayer/Configuration/Database.module';
import { AppConfigurationModule } from './UtilityLayer/Configuration/AppConfiguration.module';

// CONTROLLERS
import { AppController } from './app.controller';
import { UserController } from './ServiceLayer/Controllers/UserController';
import { AuthController } from './ServiceLayer/Controllers/AuthController';
import { FileController } from './ServiceLayer/Controllers/FileController';
import { ReviewController } from './ServiceLayer/Controllers/ReviewController';
import { HealthController } from './ServiceLayer/Controllers/HealthController';
import { SupportController } from './ServiceLayer/Controllers/SupportController';
import { BusinessController } from './ServiceLayer/Controllers/BusinessController';
import { LocationController } from './ServiceLayer/Controllers/LocationController';
import { WaitListController } from './ServiceLayer/Controllers/WaitListController';
import { UserNotificationController } from './ServiceLayer/Controllers/UserNotificationController';
import { BusinessCategoryController } from './ServiceLayer/Controllers/BusinessCategoryController';
import { UserPersonalizationController } from './ServiceLayer/Controllers/UserPersonalizationController';
import { NotificationSettingsController } from './ServiceLayer/Controllers/NotificationSettingsController';
import { UserManagementController } from './ServiceLayer/Controllers/Admin/UserManagementController';

// REPOSITORIES
import { UserRepository } from './BussinessLayer/UserRepository';
import { AuthRepository } from './BussinessLayer/AuthRepository';
import { TokenRepository } from './BussinessLayer/TokenRepository';
import { ReviewRepository } from './BussinessLayer/ReviewRepository';
import { SupportRepository } from './BussinessLayer/SupportRepository';
import { WaitlistRepository } from './BussinessLayer/WaitlistRepository';
import { BusinessRepository } from './BussinessLayer/BusinessRepository';
import { LocationRepository } from './BussinessLayer/LocationRepository';
import { UserSessionRepository } from './BussinessLayer/UserSessionRepository';
import { BusinessCategoryRepository } from './BussinessLayer/BusinessCategoryRepository';
import { UserNotificationRepository } from './BussinessLayer/UserNotificationRepository';
import { UserPersonalizationRepository } from './BussinessLayer/UserPersonalizationRepository';
import { NotificationSettingsRepository } from './BussinessLayer/NotificationSettingsRepository';

// DATA AGENTS
import { FileDataAgent } from './DataLayer/DataAgents/FileDataAgent';
import { UserDataAgent } from './DataLayer/DataAgents/UserDataAgent';
import { ReviewDataAgent } from './DataLayer/DataAgents/ReviewDataAgent';
import { SupportDataAgent } from './DataLayer/DataAgents/SupportDataAgent';
import { LocationDataAgent } from './DataLayer/DataAgents/LocationDataAgent';
import { WaitlistDataAgent } from './DataLayer/DataAgents/WaitlistDataAgent';
import { BusinessDataAgent } from './DataLayer/DataAgents/BusinessDataAgent';
import { UserSessionDataAgent } from './DataLayer/DataAgents/UserSessionDataAgent';
import { BusinessCategoryDataAgent } from './DataLayer/DataAgents/BusinessCategoryDataAgent';
import { UserNotificationDataAgent } from './DataLayer/DataAgents/UserNotificationDataAgent';
import { UserPersonalizationDataAgent } from './DataLayer/DataAgents/UserPersonalizationDataAgent';
import { NotificationSettingsDataAgent } from './DataLayer/DataAgents/NotificationSettingsDataAgent';

// SERVICES
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { RedisService } from './InfrastructureLayer/Services/redis/RedisService';
import { EmailService } from './InfrastructureLayer/Services/email/EmailService';
import { KeepAliveService } from './InfrastructureLayer/Services/KeepAliveService';
import { HttpServiceWrapper } from './InfrastructureLayer/Services/HttpServiceWrapper';
import { FileUploadService } from './InfrastructureLayer/Services/upload/FileUploadService';
import { AppConfigurationService } from './UtilityLayer/Configuration/AppConfiguration.service';
import { RestaurantSearchService } from './InfrastructureLayer/Services/RestaurantSearchService';
import { NotificationService } from './InfrastructureLayer/Services/notification/NotificationService';
import { AuthNotificationService } from './InfrastructureLayer/Services/notification/auth/AuthNotificationService';

// FACTORIES
import { FileRepository } from './BussinessLayer/FileRepository';
import { FileFactory } from './InfrastructureLayer/Services/upload/FileFactory';
import { EmailFactory } from './InfrastructureLayer/Services/email/EmailFactory';
import { EmailTemplateFactory } from './InfrastructureLayer/Services/email/EmailTemplateFactory';

// PROVIDERS
import { MailgunProvider } from './InfrastructureLayer/Services/email/providers/MailgunProvider';
import { MailjetProvider } from './InfrastructureLayer/Services/email/providers/MailjetProvider';
import { LocalDiskProvider } from './InfrastructureLayer/Services/upload/providers/LocalDiskProvider';
import { NodemailerProvider } from './InfrastructureLayer/Services/email/providers/NodemailerProvider';
import { CloudinaryProvider } from './InfrastructureLayer/Services/upload/providers/CloudinaryProvider';

// HELPERS
import { FileReferenceHelper } from './InfrastructureLayer/Helpers/FileReferenceHelper';
import { AuthNotificationHelper } from './InfrastructureLayer/Helpers/AuthNotificationHelper';

// OTHERS
import { DbAdapterEnum } from './DomainLayer/Enums/DbAdapterEnum';
import { HandlebarsEngine } from './InfrastructureLayer/Services/email/template-engine/HandleBarsEngine';
import { ManualTemplateEngine } from './InfrastructureLayer/Services/email/template-engine/ManualEngine';

@Module({
  imports: [
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => [
    //     {
    //       ttl: config.get('THROTTLE_TTL'),
    //       limit: config.get('THROTTLE_LIMIT'),
    //     },
    //   ],
    // }),
    HttpModule,
    ConfigModule,
    TerminusModule,
    AppConfigurationModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 5 }]),
    DatabaseModule.forRoot({ adapter: DbAdapterEnum.PRISMA }),
  ],
  controllers: [
    AppController,
    HealthController,
    SupportController,
    WaitListController,
    AuthController,
    FileController,
    UserController,
    UserNotificationController,
    NotificationSettingsController,
    UserPersonalizationController,
    BusinessCategoryController,
    BusinessController,
    LocationController,
    ReviewController,
    UserManagementController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    JwtService,
    AppService,
    EmailService,
    KeepAliveService,
    FileUploadService,
    NotificationService,
    AppConfigurationService,
    AuthNotificationService,
    RestaurantSearchService,

    FileFactory,
    EmailFactory,
    UserRepository,
    AuthRepository,
    FileRepository,
    TokenRepository,
    ReviewRepository,
    SupportRepository,
    WaitlistRepository,
    BusinessRepository,
    LocationRepository,
    EmailTemplateFactory,
    UserSessionRepository,
    UserNotificationRepository,
    BusinessCategoryRepository,
    NotificationSettingsRepository,
    UserPersonalizationRepository,

    UserDataAgent,
    FileDataAgent,
    ReviewDataAgent,
    SupportDataAgent,
    WaitlistDataAgent,
    LocationDataAgent,
    BusinessDataAgent,
    UserSessionDataAgent,
    BusinessCategoryDataAgent,
    UserNotificationDataAgent,
    UserPersonalizationDataAgent,
    NotificationSettingsDataAgent,

    FileReferenceHelper,
    AuthNotificationHelper,

    MailjetProvider,
    MailgunProvider,
    LocalDiskProvider,
    NodemailerProvider,
    CloudinaryProvider,

    Logger,
    HandlebarsEngine,
    HttpServiceWrapper,
    ManualTemplateEngine,
  ],
})
export class AppModule {
  async onApplicationBootstrap() {
    RedisService.getInstance().connect();
  }
}
