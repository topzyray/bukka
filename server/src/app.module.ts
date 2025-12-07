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
import { MenuController } from './ServiceLayer/Controllers/MenuController';
import { OrderController } from './ServiceLayer/Controllers/OrderController';
import { ReviewController } from './ServiceLayer/Controllers/ReviewController';
import { HealthController } from './ServiceLayer/Controllers/HealthController';
import { ServiceController } from './ServiceLayer/Controllers/ServiceController';
import { SupportController } from './ServiceLayer/Controllers/SupportController';
import { BusinessController } from './ServiceLayer/Controllers/BusinessController';
import { LocationController } from './ServiceLayer/Controllers/LocationController';
import { WaitListController } from './ServiceLayer/Controllers/WaitListController';
import { FavoriteController } from './ServiceLayer/Controllers/FavoriteController';
import { UserSessionController } from './ServiceLayer/Controllers/UserSessionController';
import { AnalyticsController } from './ServiceLayer/Controllers/Shared/AnalyticsController';
import { PlaceAdminController } from './ServiceLayer/Controllers/Admin/PlaceAdminController';
import { RecommendationController } from './ServiceLayer/Controllers/RecommendationController';
import { AdminControlController } from './ServiceLayer/Controllers/Admin/AdminControlController';
import { UserNotificationController } from './ServiceLayer/Controllers/UserNotificationController';
import { BusinessCategoryController } from './ServiceLayer/Controllers/BusinessCategoryController';
import { UserManagementController } from './ServiceLayer/Controllers/Admin/UserManagementController';
import { UserPersonalizationController } from './ServiceLayer/Controllers/UserPersonalizationController';
import { NotificationSettingsController } from './ServiceLayer/Controllers/NotificationSettingsController';

// REPOSITORIES
import { UserRepository } from './BussinessLayer/UserRepository';
import { AuthRepository } from './BussinessLayer/AuthRepository';
import { MenuRepository } from './BussinessLayer/MenuRepository';
import { TokenRepository } from './BussinessLayer/TokenRepository';
import { OrderRepository } from './BussinessLayer/OrderRepository';
import { ReviewRepository } from './BussinessLayer/ReviewRepository';
import { ServiceRepository } from './BussinessLayer/ServiceRepository';
import { SupportRepository } from './BussinessLayer/SupportRepository';
import { FavoriteRepository } from './BussinessLayer/FavoriteRepository';
import { WaitlistRepository } from './BussinessLayer/WaitlistRepository';
import { BusinessRepository } from './BussinessLayer/BusinessRepository';
import { LocationRepository } from './BussinessLayer/LocationRepository';
import { UserSessionRepository } from './BussinessLayer/UserSessionRepository';
import { RecommendationRepository } from './BussinessLayer/RecommendationRepository';
import { BusinessCategoryRepository } from './BussinessLayer/BusinessCategoryRepository';
import { UserNotificationRepository } from './BussinessLayer/UserNotificationRepository';
import { UserPersonalizationRepository } from './BussinessLayer/UserPersonalizationRepository';
import { NotificationSettingsRepository } from './BussinessLayer/NotificationSettingsRepository';

// DATA AGENTS
import { FileDataAgent } from './DataLayer/DataAgents/FileDataAgent';
import { UserDataAgent } from './DataLayer/DataAgents/UserDataAgent';
import { MenuDataAgent } from './DataLayer/DataAgents/MenuDataAgent';
import { OrderDataAgent } from './DataLayer/DataAgents/OrderDataAgent';
import { ReviewDataAgent } from './DataLayer/DataAgents/ReviewDataAgent';
import { ServiceDataAgent } from './DataLayer/DataAgents/ServiceDataAgent';
import { SupportDataAgent } from './DataLayer/DataAgents/SupportDataAgent';
import { LocationDataAgent } from './DataLayer/DataAgents/LocationDataAgent';
import { WaitlistDataAgent } from './DataLayer/DataAgents/WaitlistDataAgent';
import { BusinessDataAgent } from './DataLayer/DataAgents/BusinessDataAgent';
import { FavoriteDataAgent } from './DataLayer/DataAgents/FavoriteDataAgent';
import { UserSessionDataAgent } from './DataLayer/DataAgents/UserSessionDataAgent';
import { RecommendationDataAgent } from './DataLayer/DataAgents/RecommendationDataAgent';
import { BusinessCategoryDataAgent } from './DataLayer/DataAgents/BusinessCategoryDataAgent';
import { UserNotificationDataAgent } from './DataLayer/DataAgents/UserNotificationDataAgent';
import { UserPersonalizationDataAgent } from './DataLayer/DataAgents/UserPersonalizationDataAgent';
import { NotificationSettingsDataAgent } from './DataLayer/DataAgents/NotificationSettingsDataAgent';

// SERVICES
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { RedisService } from './InfrastructureLayer/Services/redis/RedisService';
import { QueueService } from './InfrastructureLayer/Services/queue/QueueService';
import { EmailService } from './InfrastructureLayer/Services/email/EmailService';
import { KeepAliveService } from './InfrastructureLayer/Services/KeepAliveService';
import { HttpServiceWrapper } from './InfrastructureLayer/Services/HttpServiceWrapper';
import { RoleResolverService } from './InfrastructureLayer/Services/RoleResolverService';
import { AdminControlService } from './InfrastructureLayer/Services/AdminControlService';
import { FileUploadService } from './InfrastructureLayer/Services/upload/FileUploadService';
import { PlaceImportService } from './InfrastructureLayer/Services/place/PlaceImportService';
import { AppConfigurationService } from './UtilityLayer/Configuration/AppConfiguration.service';
import { NotificationService } from './InfrastructureLayer/Services/notification/NotificationService';
import { AuthNotificationService } from './InfrastructureLayer/Services/notification/services/AuthNotificationService';
import { OrderNotificationService } from './InfrastructureLayer/Services/notification/services/OrderNotificationService';
import { ReviewNotificationService } from './InfrastructureLayer/Services/notification/services/ReviewNotificationService';
import { SupportNotificationService } from './InfrastructureLayer/Services/notification/services/SupportNotificationService';
import { ProfileNotificationService } from './InfrastructureLayer/Services/notification/services/ProfileNotificationService';
import { BusinessNotificationService } from './InfrastructureLayer/Services/notification/services/BusinessNotificationService';
import { AuthNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/AuthNotificationConsumerService';
import { OrderNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/OrderNotificationConsumerService';
import { ReviewNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/ReviewNotificationConsumerService';
import { SupportNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/SupportNotificationConsumerService';
import { ProfileNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/ProfileNotificationConsumerService';
import { BusinessNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/BusinessNotificationConsumerService';
import { RecommendationNotificationService } from './InfrastructureLayer/Services/notification/services/RecommendationNotificationService';
import { RecommendationNotificationConsumerService } from './InfrastructureLayer/Services/queue/consumers/RecommendationNotificationConsumerService';

// FACTORIES
import { FileRepository } from './BussinessLayer/FileRepository';
import { FileFactory } from './InfrastructureLayer/Services/upload/FileFactory';
import { QueueFactory } from './InfrastructureLayer/Services/queue/QueueFactory';
import { EmailFactory } from './InfrastructureLayer/Services/email/EmailFactory';
import { PlaceProviderFactory } from './InfrastructureLayer/Services/place/PlaceProviderFactory';
import { EmailTemplateFactory } from './InfrastructureLayer/Services/email/EmailTemplateFactory';

// PROVIDERS
import { BullMQProvider } from './InfrastructureLayer/Services/queue/providers/BullMQProvider';
import { MailgunProvider } from './InfrastructureLayer/Services/email/providers/MailgunProvider';
import { MailjetProvider } from './InfrastructureLayer/Services/email/providers/MailjetProvider';
import { LocalDiskProvider } from './InfrastructureLayer/Services/upload/providers/LocalDiskProvider';
import { NodemailerProvider } from './InfrastructureLayer/Services/email/providers/NodemailerProvider';
import { CloudinaryProvider } from './InfrastructureLayer/Services/upload/providers/CloudinaryProvider';
import { GooglePlaceProvider } from './InfrastructureLayer/Services/place/providers/GooglePlaceProvider';
import { GeoapifyPlaceProvider } from './InfrastructureLayer/Services/place/providers/GeoapifyPlaceProvider';

// HELPERS
import { FileReferenceHelper } from './InfrastructureLayer/Helpers/FileReferenceHelper';
import { AuthNotificationHelper } from './InfrastructureLayer/Helpers/AuthNotificationHelper';
import { OrderNotificationHelper } from './InfrastructureLayer/Helpers/OrderNotificationHelper';
import { ReviewNotificationHelper } from './InfrastructureLayer/Helpers/ReviewNotificationHelper';
import { SupportNotificationHelper } from './InfrastructureLayer/Helpers/SupportNotificationHelper';
import { ProfileNotificationHelper } from './InfrastructureLayer/Helpers/ProfileNotificationHelper';
import { BusinessNotificationHelper } from './InfrastructureLayer/Helpers/BusinessNotificationHelper';
import { RecommendationNotificationHelper } from './InfrastructureLayer/Helpers/RecommendationNotificationHelper';

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
    UserSessionController,
    UserNotificationController,
    NotificationSettingsController,
    UserPersonalizationController,
    RecommendationController,
    FavoriteController,
    BusinessCategoryController,
    BusinessController,
    MenuController,
    ServiceController,
    OrderController,
    LocationController,
    ReviewController,
    UserManagementController,
    AdminControlController,
    PlaceAdminController,
    AnalyticsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtService,
    AppService,
    EmailService,
    QueueService,
    KeepAliveService,
    FileUploadService,
    PlaceImportService,
    NotificationService,
    AdminControlService,
    RoleResolverService,
    AppConfigurationService,
    AuthNotificationService,
    // RestaurantSearchService,
    OrderNotificationService,
    ReviewNotificationService,
    SupportNotificationService,
    ProfileNotificationService,
    BusinessNotificationService,
    AuthNotificationConsumerService,
    OrderNotificationConsumerService,
    RecommendationNotificationService,
    ReviewNotificationConsumerService,
    SupportNotificationConsumerService,
    ProfileNotificationConsumerService,
    BusinessNotificationConsumerService,
    RecommendationNotificationConsumerService,

    FileFactory,
    QueueFactory,
    EmailFactory,
    UserRepository,
    AuthRepository,
    FileRepository,
    MenuRepository,
    TokenRepository,
    OrderRepository,
    ReviewRepository,
    ServiceRepository,
    SupportRepository,
    WaitlistRepository,
    BusinessRepository,
    FavoriteRepository,
    LocationRepository,
    EmailTemplateFactory,
    PlaceProviderFactory,
    UserSessionRepository,
    RecommendationRepository,
    UserNotificationRepository,
    BusinessCategoryRepository,
    UserPersonalizationRepository,
    NotificationSettingsRepository,

    UserDataAgent,
    FileDataAgent,
    MenuDataAgent,
    OrderDataAgent,
    ReviewDataAgent,
    ServiceDataAgent,
    SupportDataAgent,
    WaitlistDataAgent,
    LocationDataAgent,
    FavoriteDataAgent,
    BusinessDataAgent,
    UserSessionDataAgent,
    RecommendationDataAgent,
    BusinessCategoryDataAgent,
    UserNotificationDataAgent,
    UserPersonalizationDataAgent,
    NotificationSettingsDataAgent,

    FileReferenceHelper,
    AuthNotificationHelper,
    OrderNotificationHelper,
    ReviewNotificationHelper,
    SupportNotificationHelper,
    ProfileNotificationHelper,
    BusinessNotificationHelper,
    RecommendationNotificationHelper,

    BullMQProvider,
    MailjetProvider,
    MailgunProvider,
    LocalDiskProvider,
    NodemailerProvider,
    CloudinaryProvider,
    GooglePlaceProvider,
    GeoapifyPlaceProvider,

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
