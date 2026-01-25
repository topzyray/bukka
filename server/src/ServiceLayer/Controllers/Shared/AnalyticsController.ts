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
import { UserRepository } from 'src/BusinessLayer/UserRepository';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { AdminAuthGuard } from 'src/MiddlewareLayer/Guards/AdminAuthGuard';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/analytics`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('Analytics and Summaries')
export class AnalyticsController {
  constructor(private userRepository: UserRepository) {}

  @Get('admin/overview')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin overview stats' })
  async getAdminOverview(@Res() res?: Response) {
    const response = await this.userRepository.getAdminOverview();
    const data = BukkaResponse.GetPagedDataResponse('Admin overview', response);
    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Get('vendor/overview')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Vender overview stats' })
  async getVendorOverview(@Res() res?: Response) {
    const response = await this.userRepository.getVendorOverview();
    const data = BukkaResponse.GetPagedDataResponse(
      'Vendor overview',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Get('user/overview')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Vendor overview stats' })
  async getUserOverview(@Res() res?: Response) {
    const response = await this.userRepository.getUserOverview();
    const data = BukkaResponse.GetPagedDataResponse(
      'Vendor overview',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Get('users/activities/summary')
  @ApiOperation({ summary: 'Get user activity summary' })
  async getUserActivitiesSummary(@Res() res?: Response) {
    const response = await this.userRepository.getUserActivitiesSummary();
    const data = BukkaResponse.GetPagedDataResponse(
      'User Activity summary',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res as any);
  }
}
