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

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TerminusModule,
    DatabaseModule.forRoot({ adapter: DbAdapterEnum.PRISMA }),
    AppConfigurationModule,
  ],
  controllers: [
    AppController,
    HealthController,
    AuthController,
    UserController,
    UserNotificationController,
    NotificationSettingsController,
  ],
  providers: [
    AppService,
    AppConfigurationService,
    RestaurantSearchService,
    HttpServiceWrapper,

    EmailService,

    AuthNotificationService,
    NotificationService,

    EmailFactory,
    EmailTemplateFactory,

    AuthRepository,
    NotificationSettingsRepository,
    UserNotificationRepository,
    TokenRepository,
    UserRepository,
    JwtService,

    NotificationSettingsDataAgent,
    UserNotificationDataAgent,
    UserDataAgent,

    AuthNotificationHelper,

    NodemailerProvider,

    HandlebarsEngine,
    ManualTemplateEngine,
    Logger,
  ],
})
export class AppModule {}
