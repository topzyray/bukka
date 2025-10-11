import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  CreateNotificationDto,
  UserNotificationFilterDto,
} from 'src/DomainLayer/Dtos/UserNotificationDto';
import { UserNotificationRepository } from 'src/BussinessLayer/UserNotificationRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users/notifications`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@UseGuards(JwtAuthGuard)
@ApiTags('User Notification')
export class UserNotificationController {
  constructor(
    private _userNotificationRepository: UserNotificationRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a user's userNotification." })
  @ApiBody({ type: CreateNotificationDto })
  async createUserNotification(
    @Body() request: CreateNotificationDto,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.createUserNotification(request);
    if (response.status && response.responseData) {
      BukkaResponse.SetHeaderData(
        'createNotificationData',
        {
          title: request.title,
          message: request.message,
        },
        res,
      );
    }
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('my-notifications')
  @ApiOperation({
    summary: 'Get all user notifications by user Id',
  })
  async getUserNotificationByUserId(
    @Query() filters: UserNotificationFilterDto,
  ) {
    const response =
      await this._userNotificationRepository.findNotificationsByFilters(
        filters,
      );
    return BukkaResponse.GetPagedDataResponse('user notifications', response);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get the count of unread notifications' })
  async getUnreadNotificationsCount(@Res() res: Response) {
    const response =
      await this._userNotificationRepository.getUnreadNotificationsCount();

    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':notificationId')
  @ApiOperation({ summary: 'Get a user by notification ID' })
  @ApiParam({
    name: 'notificationId',
    description: 'The notification ID of the user',
    example: 3,
  })
  async getUserNotificationById(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.findNotificationById(
        notificationId,
      );

    const data = BukkaResponse.GetSingleDataResponse(
      'User Notification',
      response,
    );
    return res.status(data.responseCode).json(data);
  }

  @Put(':notificationId/read')
  @ApiOperation({ summary: 'Mark a notification as read.' })
  @ApiParam({
    name: 'notificationId',
    description: 'The ID of the notification',
    example: 2,
  })
  async updateUserNotification(
    @Param('notificationId') notificationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.viewUserNotification(
        notificationId,
      );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read.' })
  async readAllUserNotification(@Res() res: Response) {
    const response =
      await this._userNotificationRepository.viewAllUserNotification();
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':notificationId')
  @ApiOperation({ summary: 'Delete notificaiton' })
  @ApiParam({
    name: 'notificationId',
    description: 'The ID of the notificaiton',
    example: 1,
  })
  async deleteNotification(
    @Param('notificationId') notificationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.deleteNotification(notificationId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete('delete-my-notifications')
  @ApiOperation({ summary: 'Delete all user notifications' })
  async deleteAllUserNotifications(@Res() res: Response) {
    const response =
      await this._userNotificationRepository.deleteAllUserNotificationsByUserId();
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
