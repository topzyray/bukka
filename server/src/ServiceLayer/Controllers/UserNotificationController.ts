import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users`)
@UseGuards(JwtAuthGuard)
@ApiTags('User Notification')
@ApiBearerAuth()
export class UserNotificationController {
  constructor(
    private _userNotificationRepository: UserNotificationRepository,
  ) {}

  @Post('notifications')
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
          userId: request.userId,
          title: request.title,
          message: request.message,
        },
        res,
      );
    }
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':userId/notifications')
  @ApiOperation({
    summary: 'Get all user notifications by user Id',
  })
  async getUserNotificationByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() filters: UserNotificationFilterDto,
  ) {
    console.log('I AM HERE NOW');
    const response =
      await this._userNotificationRepository.findNotificationsByFilters(
        userId,
        filters,
      );
    return BukkaResponse.GetPagedDataResponse('user notifications', response);
  }

  @Get('notifications/:notificationId')
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

  @Post('notifications/:notificationId/read')
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

  @Post(':userId/notifications/mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read.' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 3,
  })
  async readAllUserNotification(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.viewAllUserNotification(userId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':userId/notifications/unread-count')
  @ApiOperation({ summary: 'Get the count of unread notifications' })
  async getUnreadNotificationsCount(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.getUnreadNotificationsCount(
        userId,
      );

    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete('notifications/:notificationId')
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

  @Delete(':userId/notifications')
  @ApiOperation({ summary: 'Delete all user notifications' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: '123',
  })
  async deleteAllUserNotifications(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.deleteAllUserNotificationsByUserId(
        userId,
      );
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
