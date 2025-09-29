import { HttpStatus, Injectable } from '@nestjs/common';
import { UserNotificationDataAgent } from 'src/DataLayer/DataAgents/UserNotificationDataAgent';
import { UserDataAgent } from 'src/DataLayer/DataAgents/UserDataAgent';
import {
  CreateNotificationDto,
  UserNotificationFilterDto,
} from 'src/DomainLayer/Dtos/UserNotificationDto';
import { InuResponse } from 'src/DomainLayer/Models/InuResponse';
import { IUserNotification } from '../DataLayer/Abstracts/Interface/IUserNotification';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { UserNotification } from '@prisma/client';

@Injectable()
export class UserNotificationRepository {
  constructor(
    private readonly _userNotificationDataAgent: UserNotificationDataAgent,
    private readonly _userDataAgent: UserDataAgent,
  ) {}

  async createUserNotificationAsync(
    userNotification: CreateNotificationDto,
  ): Promise<InuResponse> {
    const user = await this._userDataAgent.GetUserById(userNotification.userId);
    if (!user) {
      return InuResponse.GetSingleDataResponse('User', null);
    }

    const result = await this._userNotificationDataAgent.CreateUserNotification(
      userNotification as IUserNotification,
    );
    return InuResponse.createResponse('User notification', result);
  }

  async createMultipleUsersNotificationAsync(
    userNotification: UserNotification[],
  ): Promise<InuResponse> {
    const result =
      await this._userNotificationDataAgent.CreateUsersNotification(
        userNotification as IUserNotification[],
      );

    return InuResponse.customResponse(
      'Users notifications',
      HttpStatus.CREATED,
      true,
      result,
    );
  }

  async viewUserNotificationAsync(
    notificationId: number,
  ): Promise<InuResponse> {
    const userNotification =
      await this._userNotificationDataAgent.GetUserNotificationById(
        notificationId,
      );
    if (!userNotification) {
      return InuResponse.GetSingleDataResponse('User notification', null);
    }
    const updatedUserNotification =
      await this._userNotificationDataAgent.ViewUserNotification(
        userNotification,
      );

    return InuResponse.updateResponse(
      'User notification',
      updatedUserNotification,
    );
  }

  async viewAllUserNotificationAsync(userId: number): Promise<InuResponse> {
    if (!userId) {
      return InuResponse.GetSingleDataResponse('User', null);
    }

    await this._userNotificationDataAgent.ViewAllUserNotification(userId);

    return InuResponse.updateResponse('User notification', true);
  }

  async findById(userNotificationId: number): Promise<UserNotification | null> {
    return await this._userNotificationDataAgent.GetUserNotificationById(
      userNotificationId,
    );
  }

  async findByUserId(
    userId: number,
    filterDto: UserNotificationFilterDto,
  ): Promise<PagedData<any[]> | null> {
    const query: any = {};

    if (userId) {
      if (filterDto.isRead) {
        query.isRead = filterDto.isRead;
      }

      if (filterDto.notificationType) {
        query.notificationType = filterDto.notificationType;
      }
    }
    return await this._userNotificationDataAgent.GetUserNotificationByUserId(
      query,
      filterDto.pageSize,
      filterDto.pageNumber,
    );
  }

  async findByFilters(
    filterDto: UserNotificationFilterDto,
  ): Promise<PagedData<any[]> | null> {
    const query: any = {};

    if (filterDto.userId) {
      query.userId = filterDto.userId;
    }

    if (filterDto.isRead) {
      query.isRead = filterDto.isRead;
    }

    if (filterDto.notificationType) {
      query.notificationType = filterDto.notificationType;
    }

    return await this._userNotificationDataAgent.GetUserNotificationsByFilter(
      query,
      filterDto.pageSize,
      filterDto.pageNumber,
    );
  }
}
