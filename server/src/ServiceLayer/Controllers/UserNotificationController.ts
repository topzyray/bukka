import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { UserNotificationRepository } from 'src/BusinessLayer/UserNotificationRepository';
import { InuResponse } from 'src/DomainLayer/Models/InuResponse';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  CreateNotificationDto,
  UserNotificationFilterDto,
} from 'src/DomainLayer/Dtos/UserNotificationDto';
import { EmailService } from 'src/InfrastructureLayer/Services/EmailService';
import { UserDataAgent } from 'src/DataLayer/DataAgents/UserDataAgent';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/usernotification`)
@ApiTags('User Notification API')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class UserNotificationController {
  constructor(
    private _userNotificationRepository: UserNotificationRepository,
    private _userDataAgent: UserDataAgent,
    private _notif: EmailService,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: "Create a user's userNotification." })
  @ApiBody({ type: CreateNotificationDto })
  async createUserNotification(
    @Body() request: CreateNotificationDto,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.createUserNotificationAsync(
        request,
      );
    if (response.status && response.responseData) {
      const user = await this._userDataAgent.GetUserById(
        response.responseData?.userId,
      );
      await this._notif.sendUserNotificationEmail({
        email: user.email,
        firstName: user.firstName,
        message: response.responseData?.message,
      });
    }
    return InuResponse.GetStatusResponse(response, res);
  }

  @Post('/read/:notificationId')
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
      await this._userNotificationRepository.viewUserNotificationAsync(
        notificationId,
      );
    return InuResponse.GetStatusResponse(response, res);
  }

  @Post('/readAll/:userId')
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
      await this._userNotificationRepository.viewAllUserNotificationAsync(
        userId,
      );
    return InuResponse.GetStatusResponse(response, res);
  }

  @Get('/getById/:notificationId')
  @ApiOperation({ summary: 'Get a user by notification ID' })
  @ApiParam({
    name: 'notificationId',
    description: 'The notification ID of the user',
    example: 3,
  })
  async getUserNotificationById(
    @Param('notificationId') notificationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this._userNotificationRepository.findById(notificationId);

    const data = InuResponse.GetSingleDataResponse(
      'User Notification',
      response,
    );
    return res.status(data.responseCode).json(data);
  }

  @Get('/getByUserId/:userId')
  @ApiOperation({
    summary: 'Get all user notifications by user Id',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 2,
  })
  async getUserNotificationByUserId(
    @Param('userId') userId: number,
    @Res() res: Response,
    @Query() filters?: UserNotificationFilterDto,
  ) {
    const response = await this._userNotificationRepository.findByUserId(
      userId,
      filters,
    );
    const data = InuResponse.GetSingleDataResponse(
      'User notification',
      response,
    );
    return res.status(data.responseCode).json(data);
  }

  @Get('/getByFilters')
  @ApiOperation({ summary: 'Get all paginated user notifications' })
  async getUserNotificationsByFilters(
    @Query() filters?: UserNotificationFilterDto,
    @Res() res?: Response,
  ) {
    const response =
      await this._userNotificationRepository.findByFilters(filters);

    const data = InuResponse.GetPagedDataResponse(
      'User Notification',
      response,
    );
    return res.status(data.responseCode).json(data);
  }
}
