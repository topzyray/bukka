import { Controller, Delete, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { AdminAuthGuard } from '../../../MiddlewareLayer/Guards/AdminAuthGuard';
import { AdminApiRoutesConstant } from 'src/DomainLayer/Constants/AdminApiRoutesConstant';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { AdminControlService } from 'src/InfrastructureLayer/Services/AdminControlService';

@Controller(`${AdminApiRoutesConstant.BASE_URL}/control`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
@ApiTags('Admin Control')
export class AdminControlController {
  constructor(private controlService: AdminControlService) {}

  @Delete('invalidate-all-cache')
  @ApiOperation({ summary: 'Invalidate all cache' })
  async clearAllCache(@Res() res: Response) {
    const result = await this.controlService.clearAllCache();
    return res.status(result.responseCode).json(result);
  }
}
