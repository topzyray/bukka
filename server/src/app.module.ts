import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './UtilityLayer/Configuration/Database.module';
import { AppConfigurationModule } from './UtilityLayer/Configuration/AppConfiguration.module';
import { RestaurantSearchService } from './InfrastructureLayer/Services/RestaurantSearchService';
import { AppConfigurationService } from './UtilityLayer/Configuration/AppConfiguration.service';
import { DbAdapterEnum } from './DomainLayer/Enums/DbAdapterEnum';

@Module({
  imports: [
    DatabaseModule.forRoot({ adapter: DbAdapterEnum.PRISMA }),
    AppConfigurationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppConfigurationService,
    RestaurantSearchService,
    Logger,
  ],
})
export class AppModule {}
