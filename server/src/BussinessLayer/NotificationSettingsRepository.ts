import { Injectable } from '@nestjs/common';
import {
  CreateNotificationSettingsDto,
  NotificationSettingsFilterDto,
  UpdateNotificationSettingsDto,
} from 'src/DomainLayer/Dtos/NotificationSettingsDto';
import { NotificationSettingsDataAgent } from 'src/DataLayer/DataAgents/NotificationSettingsDataAgent';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { NotificationSettings } from 'src/DomainLayer/Models/NotificationSetting';
import { INotificationSettings } from 'src/DataLayer/Abstracts/Interfaces/INotificationSettings';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';

@Injectable()
export class NotificationSettingsRepository {
  constructor(
    private readonly _notificationSettingsDataAgent: NotificationSettingsDataAgent,
  ) {}

  async createNotificationSettings(
    dto: CreateNotificationSettingsDto,
  ): Promise<BukkaResponse<NotificationSettings>> {
    const settings =
      await this._notificationSettingsDataAgent.createNotificationSetting(
        dto as INotificationSettings,
      );
    return BukkaResponse.CreateResponse('Notification setting', settings);
  }

  async findNotificationById(
    userNotificationId: number,
  ): Promise<NotificationSettings | null> {
    return await this._notificationSettingsDataAgent.getNotificationSettingById(
      userNotificationId,
    );
  }

  async getLoggedInUserNotificationSetting(): Promise<
    BukkaResponse<NotificationSettings>
  > {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const data =
      await this._notificationSettingsDataAgent.getNotificationSettingByUserId(
        loggedInUser?.id,
      );

    return BukkaResponse.GetSingleDataResponse('User settings', data);
  }

  async findNotificationSettingByFilters(
    filterDto: NotificationSettingsFilterDto,
  ): Promise<PagedData<NotificationSettings[]> | null> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [{ field: 'userId' }],
    });

    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return this._notificationSettingsDataAgent.getNotificationSettingsByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async updateNotificationSettings(
    dto: UpdateNotificationSettingsDto,
  ): Promise<BukkaResponse<NotificationSettings>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    await UserHelper.hasAccess(loggedInUser.id);

    const settings =
      await this._notificationSettingsDataAgent.getNotificationSettingById(
        dto.id,
      );

    if (!settings) {
      return BukkaResponse.GetSingleDataResponse('Settings', null);
    }

    const updatedNotificationSettings =
      await this._notificationSettingsDataAgent.updateNotificationSetting(dto);
    return BukkaResponse.UpdateResponse(
      'Settings',
      updatedNotificationSettings,
    );
  }

  async deleteNotificationSettings(
    id: number,
  ): Promise<BukkaResponse<NotificationSettings>> {
    const settings =
      await this._notificationSettingsDataAgent.getNotificationSettingById(id);

    if (!settings) {
      return BukkaResponse.GetSingleDataResponse('Notification settings', null);
    }

    const deletedSetting =
      this._notificationSettingsDataAgent.deleteUserNotificationSetting(id);

    return BukkaResponse.DeleteResponse(
      'Notification settings',
      true,
      undefined,
      deletedSetting,
    );
  }
}
