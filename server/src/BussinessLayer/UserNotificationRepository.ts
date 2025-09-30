import { HttpStatus, Injectable } from '@nestjs/common';
import { UserNotificationDataAgent } from 'src/DataLayer/DataAgents/UserNotificationDataAgent';
import {
  CreateNotificationDto,
  UserNotificationFilterDto,
} from 'src/DomainLayer/Dtos/UserNotificationDto';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserNotification } from 'src/DomainLayer/Models/UserNotification';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';

@Injectable()
export class UserNotificationRepository {
  constructor(
    private readonly _userNotificationDataAgent: UserNotificationDataAgent,
  ) {}

  async createUserNotification(
    dto: CreateNotificationDto,
  ): Promise<BukkaResponse<UserNotification>> {
    const result = await this._userNotificationDataAgent.createUserNotification(
      dto as unknown as UserNotification,
    );
    return BukkaResponse.createResponse('user notification', result);
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
    return await this._userNotificationDataAgent.getUserNotificationById(
      userNotificationId,
    );
  }

  async getUnreadNotificationsCount(
    userId: string,
  ): Promise<BukkaResponse<number>> {
    const result =
      await this._userNotificationDataAgent.getUnreadNotificationsCount(userId);
    return BukkaResponse.GetSingleDataResponse(
      'user notification count',
      result,
    );
  }

  async findNotificationsByFilters(filterDto: UserNotificationFilterDto) {
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
    const notification = await this.findNotificationById(notificationId);
    if (!notification) {
      return BukkaResponse.errorResponse(
        'Notification not found',
        HttpStatus.NOT_FOUND,
      );
    }
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
