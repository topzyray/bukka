import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigurationService } from './AppConfiguration.service';
import { validateConfig } from './config.validation';
import * as path from 'path';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

@Module({
  exports: [AppConfigurationService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        const env = process.env.NODE_ENV?.toLowerCase();

        if (env === EnvironmentTypeEnum.PROD.toLowerCase()) {
          return path.resolve(process.cwd(), '.env.production');
        }

        if (env === EnvironmentTypeEnum.DEV.toLowerCase()) {
          return path.resolve(process.cwd(), '.env.development');
        }

        return path.resolve(process.cwd(), '.env');
      })(),
      validate: validateConfig,
    }),
  ],
  providers: [AppConfigurationService],
})
export class AppConfigurationModule {}
