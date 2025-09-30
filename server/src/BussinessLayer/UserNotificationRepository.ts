import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserDataAgent } from 'src/DataLayer/DataAgents/UserDataAgent';
import { UserNotificationDataAgent } from 'src/DataLayer/DataAgents/UserNotificationDataAgent';
import {
  CreateNotificationDto,
  UserNotificationFilterDto,
} from 'src/DomainLayer/Dtos/UserNotificationDto';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserNotification } from 'src/DomainLayer/Models/UserNotification';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';

@Injectable()
export class UserNotificationRepository {
  constructor(
    private readonly _userNotificationDataAgent: UserNotificationDataAgent,
    private readonly _userDataAgetn: UserDataAgent,
  ) {}

  async createUserNotification(
    dto: CreateNotificationDto,
  ): Promise<BukkaResponse<UserNotification>> {
    const user = await this._userDataAgetn.getUserById(dto.userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const result = await this._userNotificationDataAgent.createUserNotification(
      dto as unknown as UserNotification,
    );
    return BukkaResponse.createResponse('User notification', result);
  }

  async createMultipleUsersNotification(
    userNotifications: UserNotification[],
  ): Promise<BukkaResponse<any>> {
    const result =
      await this._userNotificationDataAgent.createMultipleUserNotifications(
        userNotifications as unknown as UserNotification[],
      );
    return BukkaResponse.createMultipleResponse(
      'user notifications',
      [],
      // result.count,
    );
  }

  async viewUserNotification(
    notificationId: number,
  ): Promise<BukkaResponse<UserNotification>> {
    const notification = await this.findNotificationById(notificationId);
    if (!notification) {
      return BukkaResponse.errorResponse(
        'Notification not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedUserNotification =
      await this._userNotificationDataAgent.updateUserNotification(
        notification.id as number,
        { isRead: true },
      );
    return BukkaResponse.updateResponse(
      'User notification',
      updatedUserNotification,
    );
  }

  async viewAllUserNotification(userId: number): Promise<BukkaResponse<any>> {
    console.log('INSIDE VIEW ALL: ', userId);
    const user = await this._userDataAgetn.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const updatedUserNotifications =
      await this._userNotificationDataAgent.viewAllUserNotification(userId);
    return BukkaResponse.updateResponse(
      'User notification',
      updatedUserNotifications,
    );
  }

  async findNotificationById(
    userNotificationId: number,
  ): Promise<UserNotification | null> {
    console.log('INSIDE FIND BY NOTIFICATION ID: ', userNotificationId);
    return await this._userNotificationDataAgent.getUserNotificationById(
      userNotificationId,
    );
  }

  async getUnreadNotificationsCount(
    userId: number,
  ): Promise<BukkaResponse<number>> {
    const user = await this._userDataAgetn.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const result =
      await this._userNotificationDataAgent.getUnreadNotificationsCount(userId);
    return BukkaResponse.GetSingleDataResponse('User notification count', {
      count: result,
    });
  }

  async findNotificationsByFilters(filterDto: UserNotificationFilterDto) {
    console.log('INDISE FILTERS: ', filterDto);

    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [
        { field: 'userId' },
        { field: 'isRead' },
        { field: 'notificationCategory' },
      ],
      searchConfig: {
        fields: ['title', 'message'],
        mode: 'insensitive',
      },
    });

    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);

    return this._userNotificationDataAgent.getUserNotificationsByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async deleteNotification(notificationId: number) {
    const loggedInUser = await UserHelper.getLoggedInUser();

    const notification = await this.findNotificationById(notificationId);
    if (!notification) {
      return BukkaResponse.errorResponse(
        'Notification not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // if (loggedInUser?.userId !== notification?.userId) {
    //   return BukkaResponse.errorResponse(
    //     'You do not have access to this resource!',
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    await UserHelper.hasAccess(notification?.userId);
    const deletedNotification =
      await this._userNotificationDataAgent.deleteNotification(
        notification.id as number,
      );

    return BukkaResponse.deleteResponse(
      'User notification',
      true,
      undefined,
      deletedNotification,
    );
  }

  async deleteAllUserNotificationsByUserId(userId: number) {
    const deletedUserNotifications =
      await this._userNotificationDataAgent.deleteAllUserNotificationsByUserId(
        userId,
      );
    if (deletedUserNotifications === null) {
      return BukkaResponse.errorResponse(
        'No user notification found!',
        HttpStatus.NOT_FOUND,
      );
    }
    return BukkaResponse.deleteResponse(
      'User notification',
      true,
      undefined,
      deletedUserNotifications,
    );
  }
}
