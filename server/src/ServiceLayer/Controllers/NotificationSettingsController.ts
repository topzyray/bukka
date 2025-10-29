import type { Response } from 'express';
import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Res,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateNotificationSettingsDto } from 'src/DomainLayer/Dtos/NotificationSettingsDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users/notification-settings`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('Notification Settings')
export class NotificationSettingsController {
  constructor(
    private readonly notificationSettingsRepository: NotificationSettingsRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get logged in user notifications settings' })
  async getLoggedInUserNotificationSettings(@Res() res: Response) {
    const response =
      await this.notificationSettingsRepository.getLoggedInUserNotificationSetting();
    return BukkaResponse.GetStatusResponse(response, res);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all paginated user notifications settings' })
  // async getNotificationSettingsByFilters(
  //   @Query() request: NotificationSettingsFilterDto,
  //   @Res() res: Response,
  // ) {
  //   const response =
  //     await this.notificationSettingsRepository.findNotificationSettingByFilters(
  //       request,
  //     );
  //   const data = BukkaResponse.GetPagedDataResponse(
  //     'notification settings',
  //     response,
  //   );
  //   return res.status(data.responseCode).json(data);
  // }

  @Put()
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

  @Delete(':notificationId')
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
