import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpServiceWrapper } from './HttpServiceWrapper';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { BukkaCronExpression } from 'src/DomainLayer/Enums/BukkaCronExpression';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(
    private readonly httpService: HttpServiceWrapper,
    private readonly configService: AppConfigurationService,
  ) {}

  @Cron(BukkaCronExpression.EVERY_14_MINUTES)
  async pingSelf() {
    try {
      const res = await this.httpService.get(this.configService.appUrl);
      this.logger.log(`Keep-alive ping successful: ${res.status}`);
    } catch (error) {
      this.logger.warn(`Keep-alive ping failed: ${error.message}`);
    }
  }
}
