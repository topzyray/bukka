import type { Response } from 'express';
import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Res,
  Query,
  Put,
} from '@nestjs/common';
import {
  NotificationSettingsFilterDto,
  UpdateNotificationSettingsDto,
} from 'src/DomainLayer/Dtos/NotificationSettingsDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users`)
@ApiTags('Notification Settings')
@ApiBearerAuth()
export class NotificationSettingsController {
  constructor(
    private readonly notificationSettingsRepository: NotificationSettingsRepository,
  ) {}

  @Get(':userId/notification-settings')
  @ApiOperation({ summary: 'Get user notifications settings by userId' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: '123',
  })
  async getNotificationSettings(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.notificationSettingsRepository.findNotificationSettingByUserId(
        userId,
      );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('notification-settings')
  @ApiOperation({ summary: 'Get all paginated user notifications settings' })
  async getNotificationSettingsByFilters(
    @Query() request: NotificationSettingsFilterDto,
    @Res() res: Response,
  ) {
    const response =
      await this.notificationSettingsRepository.findNotificationSettingByFilters(
        request,
      );
    const data = BukkaResponse.GetPagedDataResponse(
      'notification settings',
      response,
    );
    return res.status(data.responseCode).json(data);
  }

  @Put('notification-settings')
  @ApiOperation({ summary: 'Update user notifications settings' })
  @ApiBody({ type: UpdateNotificationSettingsDto })
  async updateNotificationSettings(
    @Body() dto: UpdateNotificationSettingsDto,
    @Res() res: Response,
  ) {
    const settings =
      await this.notificationSettingsRepository.updateNotificationSettings(dto);
    return BukkaResponse.GetStatusResponse(settings, res);
  }

  @Delete('notification-settings/:notificationId')
  @ApiOperation({
    summary: 'Delete user notifications settings by notificationId',
  })
  async deleteNotificationSettings(
    @Param('notificationId') notificationId: number,
    @Res() res: Response,
  ): Promise<void> {
    const settings =
      await this.notificationSettingsRepository.deleteNotificationSettings(
        notificationId,
      );
    return BukkaResponse.GetStatusResponse(settings, res);
  }
}
