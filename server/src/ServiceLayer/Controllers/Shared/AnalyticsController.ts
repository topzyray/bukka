import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserRepository } from 'src/BussinessLayer/UserRepository';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/analytics`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('Analytics and Summaries')
export class AnalyticsController {
  constructor(private userRepository: UserRepository) {}

  @Get('admin/overview')
  @ApiOperation({ summary: 'Admin overview stats' })
  async getAdminOverview(@Res() res?: Response) {
    const response = await this.userRepository.getAdminOverview();
    const data = BukkaResponse.GetPagedDataResponse('Admin overview', response);
    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Get('users/activities/summary')
  @ApiOperation({ summary: 'Get user activity summary' })
  async getUserSummary(@Res() res?: Response) {
    const response = await this.userRepository.getUserActivitiesOverview();
    const data = BukkaResponse.GetPagedDataResponse(
      'Activity summary',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res as any);
  }
}
