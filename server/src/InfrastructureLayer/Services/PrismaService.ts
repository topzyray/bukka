import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger(PrismaService.name);

  constructor(private readonly configService: AppConfigurationService) {
    super({
      log: ['warn'],
    });

    this.$on('query' as never, (e: any) => {
      if (this.configService.nodeEnv !== EnvironmentTypeEnum.PROD) {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      } else if (e.duration > 200) {
        this.logger.warn(`Slow Query (${e.duration}ms): ${e.query}`);
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to Database successfully!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from Database successfully!');
  }
}
