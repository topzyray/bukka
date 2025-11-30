import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserNotificationDataAgent } from 'src/DataLayer/DataAgents/UserNotificationDataAgent';
import {
  CreateNotificationDto,
  UserNotificationFilterDto,
} from 'src/DomainLayer/Dtos/UserNotificationDto';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserNotification } from 'src/DomainLayer/Models/UserNotification';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';

@Injectable()
export class UserNotificationRepository {
  constructor(
    private readonly _userNotificationDataAgent: UserNotificationDataAgent,
  ) {}

  async createUserNotification(
    dto: CreateNotificationDto,
  ): Promise<BukkaResponse<UserNotification>> {
    // const loggedInUser = await UserHelper.getLoggedInUser();
    const newUserNotification = { ...dto };
    const result = await this._userNotificationDataAgent.createUserNotification(
      newUserNotification as unknown as UserNotification,
    );
    return BukkaResponse.CreateResponse('User notification', result);
  }

  async createMultipleUsersNotification(
    userNotifications: CreateNotificationDto[],
  ): Promise<BukkaResponse<{ count: number }>> {
    const result =
      await this._userNotificationDataAgent.createMultipleUserNotifications(
        userNotifications as unknown as UserNotification[],
      );
    return BukkaResponse.CreateMultipleResponse(
      'User notifications',
      [],
      result.count,
    );
  }

  async viewUserNotification(
    notificationId: number,
  ): Promise<BukkaResponse<UserNotification>> {
    const notification = await this.findNotificationById(notificationId);
    if (!notification) {
      return BukkaResponse.ErrorResponse(
        'Notification not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedUserNotification =
      await this._userNotificationDataAgent.updateUserNotification(
        notification.id as number,
        { isRead: true },
      );
    return BukkaResponse.UpdateResponse(
      'User notification',
      updatedUserNotification,
    );
  }

  async viewAllUserNotification(): Promise<BukkaResponse<any>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const updatedUserNotifications =
      await this._userNotificationDataAgent.viewAllUserNotification(
        loggedInUser?.id as number,
      );
    return BukkaResponse.UpdateResponse(
      'User notification',
      updatedUserNotifications,
    );
  }

  async findNotificationById(
    notificationId: number,
  ): Promise<UserNotification | null> {
    return await this._userNotificationDataAgent.getUserNotificationById(
      notificationId,
    );
  }

  async getUnreadNotificationsCount(): Promise<BukkaResponse<number>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const result =
      await this._userNotificationDataAgent.getUnreadNotificationsCount(
        loggedInUser?.id as number,
      );
    return BukkaResponse.GetSingleDataResponse('User notification count', {
      count: result,
    });
  }

  async findNotificationsByFilters(filterDto: UserNotificationFilterDto) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const mergedFilters = { ...filterDto, userId: loggedInUser?.id };
    return handleCache(
      'notifications',
      mergedFilters,
      () => {
        const query = FilterQueryHelper.buildQuery({
          dto: mergedFilters,
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
          FilterQueryHelper.extractPagination(mergedFilters);
        return this._userNotificationDataAgent.getUserNotificationsByFilter(
          query,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.NOTIFICATION,
    );
  }

  async deleteNotification(notificationId: number) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const notification = await this.findNotificationById(notificationId);
    if (!notification) {
      return BukkaResponse.ErrorResponse(
        'Notification not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (loggedInUser?.id !== notification?.userId) {
      return BukkaResponse.ErrorResponse(
        'You do not have access to this resource!',
        HttpStatus.FORBIDDEN,
      );
    }
    await UserHelper.hasAccess(notification?.userId);
    const deletedNotification =
      await this._userNotificationDataAgent.deleteNotification(
        notification.id as number,
      );

    await invalidateCache('notifications', {});
    await invalidateCache('notifications:count', {});

    return BukkaResponse.DeleteResponse(
      'User notification',
      true,
      undefined,
      deletedNotification,
    );
  }

  async deleteAllUserNotifications() {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const deletedUserNotifications =
      await this._userNotificationDataAgent.deleteAllUserNotifications(
        loggedInUser?.id,
      );
    if (deletedUserNotifications === null) {
      return BukkaResponse.ErrorResponse(
        'No user notification found!',
        HttpStatus.NOT_FOUND,
      );
    }

    return BukkaResponse.DeleteResponse(
      'User notification',
      true,
      undefined,
      deletedUserNotifications,
    );
  }
}
