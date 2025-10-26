import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDataAgent } from 'src/DataLayer/DataAgents/UserDataAgent';
import {
  CreateUserDto,
  ProfileUpdateDto,
  UserDto,
  UserFilterDto,
} from 'src/DomainLayer/Dtos/UserDto';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';
import { AdminUserFilterDto } from 'src/DomainLayer/Dtos/Admin/AdminUserDto';
import { User } from 'src/DomainLayer/Models/User';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { CacheTTLPolicy } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
@Injectable()
export class UserRepository {
  constructor(private readonly _userDataAgent: UserDataAgent) {}

  async createUserAsync(data: CreateUserDto): Promise<BukkaResponse<User>> {
    const existingUser = await this._userDataAgent.getUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }
    data.confirmationCode = Generator.GenerateDigits(6).toString();
    data.confirmationCodeExpires = Generator.CalculateExpirationTime(30);
    const user = data as User;
    const result = await this._userDataAgent.createUserAsync(user);
    return BukkaResponse.CustomResponse(
      `We've sent a verification token to ${result.email}. Check your Inbox or Spam for further actions.`,
      HttpStatus.CREATED,
      true,
      result,
    );
  }

  async findUserById(userId: number) {
    return this._userDataAgent.getUserById(userId);
  }

  async getLoggedInUserData() {
    const user = await UserHelper.getLoggedInUser();
    return handleCache(
      'user:profile',
      { id: user.id },
      () => this._userDataAgent.getUserById(user.id),
      CacheTTLPolicy.PROFILE,
    );
  }

  async findUserByToken(token: string, type: TokenTypeEnum) {
    return this._userDataAgent.getUserByToken(token, type);
  }

  async findAdminUserById(userId: number) {
    return this._userDataAgent.getAdminUserById(userId);
  }

  async findAdminUserByRole() {
    return this._userDataAgent.getAdminUserByRole();
  }

  async findUserByEmail(email: string) {
    return this._userDataAgent.getUserByEmail(email);
  }

  async updateOtherUserAsync(
    userId: number,
    data: Partial<User>,
  ): Promise<BukkaResponse<User>> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const updatedUser = await this._userDataAgent.updateUser(userId, data);
    return BukkaResponse.UpdateResponse('User', updatedUser);
  }

  async updateUserDataAsync(data: Partial<User>): Promise<BukkaResponse<User>> {
    const loggedInUser = await UserHelper.getLoggedInUser();

    // const {
    //   longitude,
    //   latitude,
    //   address,
    //   placeId,
    //   city,
    //   state,
    //   country,
    //   zipCode,
    //   cityId,
    //   stateId,
    //   countryId,
    //   ...userData
    // } = data;

    // let location = await this.locationDataAgent.FindLocation(placeId);

    // if (!location) {
    //   location = await this.locationDataAgent.CreateLocationAsync({
    //     latitude,
    //     longitude,
    //     address,
    //     placeId,
    //     city,
    //     state,
    //     country,
    //     zipCode,
    //     cityId,
    //     stateId,
    //     countryId,
    //   });
    // }

    // const updateUserData = {
    //   ...userData,
    //   locationId: location.id,
    // };

    const updatedUser = await this._userDataAgent.updateUser(
      loggedInUser?.id,
      data,
    );
    await invalidateCache('user:profile', { id: loggedInUser.id });
    return BukkaResponse.UpdateResponse('User', updatedUser);
  }

  async updateUserProfileAsync(
    userProfileDto: ProfileUpdateDto,
  ): Promise<BukkaResponse<User | null>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    // const {
    //   username,
    //   phoneNumber,
    //   bio,
    //   longitude,
    //   latitude,
    //   address,
    //   placeId,
    //   city,
    //   state,
    //   country,
    //   zipCode,
    //   cityId,
    //   stateId,
    //   countryId,
    // } = userProfileDto;

    // let location = await this.locationDataAgent.FindLocation(placeId);

    // if (location) {
    //   location = await this.locationDataAgent.UpdateAddressAsync(location.id, {
    //     latitude: latitude || location.latitude,
    //     longitude: longitude || location.longitude,
    //     address: address || location.address,
    //     city: city || location.city,
    //     state: state || location.state,
    //     country: country || location.country,
    //     zipCode: zipCode || location.zipCode,
    //     cityId: cityId || location.cityId,
    //     stateId: stateId || location.stateId,
    //     countryId: countryId || location.countryId,
    //   });
    // } else {
    //   location = await this.locationDataAgent.CreateLocationAsync({
    //     latitude,
    //     longitude,
    //     address,
    //     placeId,
    //     city,
    //     state,
    //     country,
    //     zipCode,
    //     cityId,
    //     stateId,
    //     countryId,
    //   });
    // }

    // const updateProfileData = {
    //   username,
    //   phoneNumber,
    //   bio,
    //   locationId: location.id,
    // };
    const updatedUser = await this._userDataAgent.updateUser(
      loggedInUser?.id,
      userProfileDto,
    );
    await invalidateCache('user:profile', { id: loggedInUser.id });
    return BukkaResponse.UpdateResponse('User', updatedUser);
  }

  async completeProfileOnboarding(): Promise<BukkaResponse<User | null>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const data = {
      isOnboarded: true,
    } as Partial<User>;
    const updatedUser = await this._userDataAgent.updateUser(
      loggedInUser?.id,
      data,
    );
    await invalidateCache('user:profile', { id: loggedInUser.id });
    return BukkaResponse.UpdateResponse('User', updatedUser);
  }

  async adminUpdateUserAsync(
    data: Partial<UserDto>,
  ): Promise<BukkaResponse<User | null>> {
    const { id, ...updateData } = data;
    const user = await this.findUserById(id as number);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const updatedUser = await this._userDataAgent.updateUser(
      id as number,
      updateData,
    );
    return BukkaResponse.UpdateResponse('User', updatedUser);
  }

  async deleteUser(userId: number): Promise<BukkaResponse<void>> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    await this._userDataAgent.deleteUser(user?.id as number);
    await invalidateCache('users:list', {});
    await invalidateCache('users:admin', {});
    await invalidateCache('user:profile', { id: userId });
    return BukkaResponse.DeleteResponse('User', true);
  }

  async findByFilters(filterDto: UserFilterDto): Promise<PagedData<any[]>> {
    const { userId, ...otherFilters } = filterDto;
    const mergedFilters = { id: userId, ...otherFilters };
    const query = FilterQueryHelper.buildQuery({
      dto: mergedFilters,
      rules: [{ field: 'userStatus' }, { field: 'phoneNumber' }],
      searchConfig: {
        fields: ['username', 'email', 'firstName', 'lastName'],
        mode: 'insensitive',
      },
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(mergedFilters);
    return handleCache(
      'users:list',
      mergedFilters,
      () => this._userDataAgent.getUsersByFilter(query, pageSize, pageNumber),
      CacheTTLPolicy.USER_LIST,
    );
  }

  async adminFindByFilters(filterDto: AdminUserFilterDto) {
    const { userId, ...otherFilters } = filterDto;
    const mergedFilters = { id: userId, ...otherFilters };
    const query = FilterQueryHelper.buildQuery({
      dto: mergedFilters,
      rules: [
        { field: 'id' },
        { field: 'role' },
        { field: 'gender' },
        { field: 'isDeleted' },
        { field: 'userStatus' },
        { field: 'isOnboarded' },
        { field: 'emailConfirmed' },
      ],
      searchConfig: {
        fields: ['username', 'email', 'firstName', 'lastName'],
        mode: 'insensitive',
      },
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(mergedFilters);
    return handleCache(
      'users:admin',
      mergedFilters,
      () =>
        this._userDataAgent.adminGetUsersByFilter(query, pageSize, pageNumber),
      CacheTTLPolicy.USER_LIST,
    );
  }

  async getAdminOverview() {
    const result = await this._userDataAgent.getAdminOverview();
    return result;
  }
}
