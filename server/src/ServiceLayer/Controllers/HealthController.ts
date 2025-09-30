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

@Controller(`${BaseApiRoutesConstant.BASE_URL}/health`)
@ApiTags('Health Check')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly httpIndicator: HttpHealthIndicator,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly prismaClient: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const bukkaUrl = AppUrlTypeEnum.LOCAL;
    return this.healthService.check([
      () => this.httpIndicator.pingCheck('bukka', bukkaUrl),
      () => this.prismaIndicator.pingCheck('postgres', this.prismaClient),
    ]);
  }
}
