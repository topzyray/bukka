import { HttpStatus, Injectable } from '@nestjs/common';
import { Location, User } from '@prisma/client';
import { IUser } from 'src/DataLayer/Abstracts/Interface/IUser';
import { UserDataAgent } from 'src/DataLayer/DataAgents/UserDataAgent';
import {
  CreateUserDto,
  ProfileUpdateDto,
  UserDto,
  UserFilterDto,
} from 'src/DomainLayer/Dtos/UserDto';
import { InuResponse } from 'src/DomainLayer/Models/InuResponse';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';
import { FilesRepository } from './FilesRepository';
import { LocationDataAgent } from 'src/DataLayer/DataAgents/LocationDataAgent';
import { UserWithCounts } from 'src/DomainLayer/Models/UserWithCounts';
import { AdminUserFilterDto } from 'src/DomainLayer/Dtos/Admin/AdminUserDto';
import { FollowerRepository } from './FollowRepository';
@Injectable()
export class UserRepository {
  constructor(
    private readonly _userDataAgent: UserDataAgent,
    private readonly _fileRepo: FilesRepository,
    private readonly locationDataAgent: LocationDataAgent,
    private readonly followerRepository: FollowerRepository,
  ) {}

  async createUserAsync(data: CreateUserDto): Promise<InuResponse> {
    const existingUser = await this._userDataAgent.GetUserByEmail(data.email);
    if (existingUser) {
      return InuResponse.conflictResponse('email');
    }

    data.confirmationCode = Generator.GenerateDigits(6).toString();
    data.confirmationCodeExpires = Generator.calculateExpirationTime(30);

    const user = data as IUser;
    const result = await this._userDataAgent.CreateUserAsync(user);

    return InuResponse.customResponse(
      `We've sent a verification email to ${result.email}. Please check your inbox and follow the instructions to verify your email. If you don't see the email within a few minutes, check your spam or junk folder.`,
      HttpStatus.OK,
      true,
      result,
    );
  }

  async findUserById(userId: number) {
    const user = this._userDataAgent.GetUserById(userId);
    return user;
  }

  async findAdminUserById(userId: number) {
    const user = this._userDataAgent.GetAdminUserById(userId);
    return user;
  }

  async findAdminUserByRole() {
    const user = this._userDataAgent.GetAdminUserByRole();
    return user;
  }

  async findUserByEmail(email: string): Promise<UserWithCounts | null> {
    return this._userDataAgent.GetUserByEmail(email);
  }

  async updateOtherUserAsync(
    userId: number,
    data: Partial<User>,
  ): Promise<InuResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      return InuResponse.errorResponse('User not found.', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this._userDataAgent.UpdateUser(userId, data);
    return InuResponse.updateResponse('User', updatedUser);
  }

  async updateUserDataAsync(
    userId: number,
    data: Partial<User & Location>,
  ): Promise<InuResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      return InuResponse.errorResponse('User not found.', HttpStatus.NOT_FOUND);
    }

    const {
      longitude,
      latitude,
      address,
      placeId,
      city,
      state,
      country,
      zipCode,
      cityId,
      stateId,
      countryId,
      ...userData
    } = data;

    let location = await this.locationDataAgent.FindLocation(placeId);

    if (!location) {
      location = await this.locationDataAgent.CreateLocationAsync({
        latitude,
        longitude,
        address,
        placeId,
        city,
        state,
        country,
        zipCode,
        cityId,
        stateId,
        countryId,
      });
    }

    const updateUserData = {
      ...userData,
      locationId: location.id,
    };

    const updatedUser = await this._userDataAgent.UpdateUser(
      userId,
      updateUserData,
    );

    return InuResponse.updateResponse('User', updatedUser);
  }

  async updateUserProfileAsync(
    userId: number,
    userProfileDto: ProfileUpdateDto,
  ): Promise<InuResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      return InuResponse.errorResponse('User not found.', HttpStatus.NOT_FOUND);
    }

    const {
      username,
      phoneNumber,
      bio,
      longitude,
      latitude,
      address,
      placeId,
      city,
      state,
      country,
      zipCode,
      cityId,
      stateId,
      countryId,
    } = userProfileDto;

    let location = await this.locationDataAgent.FindLocation(placeId);

    if (location) {
      location = await this.locationDataAgent.UpdateAddressAsync(location.id, {
        latitude: latitude || location.latitude,
        longitude: longitude || location.longitude,
        address: address || location.address,
        city: city || location.city,
        state: state || location.state,
        country: country || location.country,
        zipCode: zipCode || location.zipCode,
        cityId: cityId || location.cityId,
        stateId: stateId || location.stateId,
        countryId: countryId || location.countryId,
      });
    } else {
      location = await this.locationDataAgent.CreateLocationAsync({
        latitude,
        longitude,
        address,
        placeId,
        city,
        state,
        country,
        zipCode,
        cityId,
        stateId,
        countryId,
      });
    }

    const updateProfileData = {
      username,
      phoneNumber,
      bio,
      locationId: location.id,
    };

    const updatedUser = await this._userDataAgent.UpdateUser(
      userId,
      updateProfileData,
    );

    return InuResponse.updateResponse('User', updatedUser);
  }

  async adminUpdateUserAsync(data: Partial<UserDto>): Promise<InuResponse> {
    const user = await this.findUserById(data.id);
    if (!user) {
      return InuResponse.errorResponse('User not found.', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this._userDataAgent.UpdateUser(data.id, data);

    return InuResponse.updateResponse('User', updatedUser);
  }

  async deleteUser(userId: number): Promise<InuResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      return InuResponse.errorResponse('User not found.', HttpStatus.NOT_FOUND);
    }

    await this._userDataAgent.DeleteUser(userId);
    return InuResponse.deleteResponse('User', true);
  }

  async findByFilters(filterDto: UserFilterDto): Promise<PagedData<any[]>> {
    const query: any = {};

    if (filterDto.userStatus) {
      query.userStatus = filterDto.userStatus;
    }

    if (filterDto.userId) {
      query.id = Number(filterDto.userId);
    }

    if (filterDto.search) {
      query.OR = [
        { username: { contains: filterDto.search, mode: 'insensitive' } },
        { firstName: { contains: filterDto.search, mode: 'insensitive' } },
        { lastName: { contains: filterDto.search, mode: 'insensitive' } },
        { email: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    const data = await this._userDataAgent.GetUsersByFilter(
      query,
      filterDto.pageSize,
      filterDto.pageNumber,
    );

    return data;
  }

  async adminFindByFilters(
    filterDto: AdminUserFilterDto,
  ): Promise<PagedData<any[]>> {
    const query: any = {};

    if (filterDto.userStatus) {
      query.userStatus = filterDto.userStatus;
    }

    if (filterDto.userId) {
      query.id = Number(filterDto.userId);
    }

    if (filterDto.search) {
      query.OR = [
        { firstName: { contains: filterDto.search, mode: 'insensitive' } },
        { lastName: { contains: filterDto.search, mode: 'insensitive' } },
        { email: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    const data = await this._userDataAgent.AdminGetUsersByFilter(
      query,
      filterDto.pageSize,
      filterDto.pageNumber,
    );

    return data;
  }

  async addFileToUser(userId: number, fileId: number): Promise<InuResponse> {
    const user = await this.findUserById(userId);

    if (!user) {
      return InuResponse.errorResponse('User not found.', HttpStatus.NOT_FOUND);
    }

    const file = await this._fileRepo.GetFileById(fileId);

    if (!file) {
      return InuResponse.errorResponse('File not found.', HttpStatus.NOT_FOUND);
    }

    if (file.referenceId !== userId) {
      return InuResponse.errorResponse(
        `File ID ${file.id} not associated with restaurant with ID ${userId}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.connectUserFile(user.id, fileId);

    if (!result) {
      return InuResponse.errorResponse('Failed to connect file to user.');
    }

    return InuResponse.customResponse(
      'File connected to user successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }

  async getAdminOverview() {
    const result = await this._userDataAgent.getAdminOverview();
    return result;
  }

  private async connectUserFile(userId: number, fileId: number) {
    const result = this._userDataAgent.ConnectUserFile(userId, fileId);
    return result;
  }
}

