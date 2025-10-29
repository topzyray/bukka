import { HttpStatus, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { UserPersonalizationDataAgent } from 'src/DataLayer/DataAgents/UserPersonalizationDataAgent';
import { UserPersonalization } from 'src/DomainLayer/Models/UserPersonalization';
import {
  CreateUserPersonalizationDto,
  UpdateUserPersonalizationDto,
  UserPersonalizationFilterDto,
} from 'src/DomainLayer/Dtos/UserPersonalizationDto';

@Injectable()
export class UserPersonalizationRepository {
  constructor(
    private readonly _userPersonalizationDataAgent: UserPersonalizationDataAgent,
  ) {}

  async createUserPersonalization(
    dto: CreateUserPersonalizationDto,
  ): Promise<BukkaResponse<UserPersonalization>> {
    const loggedInUser = await UserHelper.getLoggedInUser();

    const existingData =
      await this._userPersonalizationDataAgent.getUserPersonalizationByUserId(
        loggedInUser.id,
      );
    if (existingData) {
      return BukkaResponse.CreateResponse('User personalization', existingData);
    }
    const data = {
      ...dto,
      userId: loggedInUser.id,
    };
    const result =
      await this._userPersonalizationDataAgent.createUserPersonalization(
        data as Partial<UserPersonalization>,
      );

    return BukkaResponse.CreateResponse('User personalization', result);
  }

  async findPersonalizationById(
    personalizationId: number,
  ): Promise<UserPersonalization | null> {
    return await this._userPersonalizationDataAgent.getUserPersonalizationById(
      personalizationId,
    );
  }

  async getLoggedInUserPersonalization(): Promise<
    BukkaResponse<UserPersonalization>
  > {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const data =
      await this._userPersonalizationDataAgent.getUserPersonalizationByUserId(
        loggedInUser?.id,
      );

    return BukkaResponse.GetSingleDataResponse('User psersonalization', data);
  }

  async findPersonalizationSettingByFilters(
    filterDto: UserPersonalizationFilterDto,
  ): Promise<PagedData<UserPersonalization[]> | null> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [
        { field: 'preferredCuisines' },
        { field: 'dietaryRestrictions' },
        { field: 'mealPreferences' },
        { field: 'paymentPreference' },
        { field: 'preferredDeliveryTime' },
        { field: 'allergies' },
      ],
      searchConfig: {
        fields: [
          'preferredCuisines',
          'dietaryRestrictions',
          'mealPreferences',
          'paymentPreference',
          'preferredDeliveryTime',
          'allergies',

          //  { field: 'cuisines', dtoKey: 'cuisines', defaultOp: 'has' },
        ],
        mode: 'insensitive',
      },
    });

    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return this._userPersonalizationDataAgent.getUserPersonalizationByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async updateUserPersonalization(
    dto: UpdateUserPersonalizationDto,
  ): Promise<BukkaResponse<any>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    await UserHelper.hasAccess(loggedInUser.id);

    const { personalizationId, ...otherDto } = dto;

    const userpersonalization =
      await this._userPersonalizationDataAgent.getUserPersonalizationById(
        dto.personalizationId,
      );

    if (!userpersonalization) {
      return BukkaResponse.GetSingleDataResponse('User personalization', null);
    }

    const updateData = {
      ...otherDto,
      userId: loggedInUser?.id,
    } as Partial<UserPersonalization>;

    const updatedUserPersonalization =
      await this._userPersonalizationDataAgent.updateUserPersonalization(
        updateData,
      );
    return BukkaResponse.UpdateResponse(
      'User personalization',
      updatedUserPersonalization,
    );
  }

  async deleteUserPersonalization(
    id: number,
  ): Promise<BukkaResponse<UserPersonalization>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    await UserHelper.hasAccess(loggedInUser.id);

    const userpersonalization =
      await this._userPersonalizationDataAgent.getUserPersonalizationById(id);

    if (!userpersonalization) {
      return BukkaResponse.GetSingleDataResponse('User personalization', null);
    }

    const deletedPersonalization =
      this._userPersonalizationDataAgent.deleteUserPersonalization(id);

    return BukkaResponse.DeleteResponse(
      'Personalization',
      true,
      undefined,
      deletedPersonalization,
    );
  }
}
