import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigurationService } from './AppConfiguration.service';
import { validateConfig } from './config.validation';

@Module({
  exports: [AppConfigurationService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
  ],
  providers: [AppConfigurationService],
})
export class AppConfigurationModule {}
