import type { Response } from 'express';
import {
  Controller,
  Get,
  Delete,
  Param,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { UserSessionRepository } from 'src/BussinessLayer/UserSessionRepository';
import { ActiveSessionDto } from 'src/DomainLayer/Dtos/UserSessionDto';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users/sessions`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('User Session')
export class UserSessionController {
  constructor(private readonly userSessionRepository: UserSessionRepository) {}

  @Get()
  @ApiOperation({ summary: 'Get logged in user sessions' })
  async getLoggedInUserSessions(@Res() res: Response) {
    const response = await this.userSessionRepository.getLoggedInUserSessions();
    const mappedData = TypeSafeMapper.mapArray(response.responseData, {
      exclude: ['refreshToken'],
    });
    response.responseData = mappedData;
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('active-session')
  @ApiOperation({ summary: 'Get user active session' })
  async findActiveSession(
    @Query() query: ActiveSessionDto,
    @Res() res: Response,
  ) {
    const response = await this.userSessionRepository.findActiveSession(
      query?.userId,
      query?.deviceId,
    );
    const mappedData = TypeSafeMapper.mapObject(response?.responseData, {
      exclude: ['refreshToken'],
    });
    response.responseData = mappedData;
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':sessionId')
  @ApiOperation({
    summary: 'Delete user session by ID',
  })
  async deleteSessionById(
    @Param('sessionId') sessionId: number,
    @Res() res: Response,
  ): Promise<void> {
    const response =
      await this.userSessionRepository.deleteSessionById(sessionId);
    const data = BukkaResponse.DeleteResponse(
      'Session',
      true,
      undefined,
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }
}
