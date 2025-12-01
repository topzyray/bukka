import { Controller, Get } from '@nestjs/common';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { PrismaService } from 'src/InfrastructureLayer/Services/PrismaService';
import { AppUrlTypeEnum } from 'src/DomainLayer/Enums/AppUrlTypeEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/health`)
@ApiTags('Health Check')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly httpIndicator: HttpHealthIndicator,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly prismaClient: PrismaService,
    private readonly configService: AppConfigurationService,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const bukkaUrl =
      this.configService.nodeEnv === EnvironmentTypeEnum.DEV
        ? AppUrlTypeEnum.CLIENT_DEV
        : AppUrlTypeEnum.CLIENT_PROD;
    return this.healthService.check([
      () => this.httpIndicator.pingCheck('bukka', bukkaUrl),
      () => this.prismaIndicator.pingCheck('postgres', this.prismaClient),
    ]);
  }
}
