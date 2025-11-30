import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { UserSessionDataAgent } from 'src/DataLayer/DataAgents/UserSessionDataAgent';
import { FavoriteDataAgent } from 'src/DataLayer/DataAgents/FavoriteDataAgent';
import { ReviewDataAgent } from 'src/DataLayer/DataAgents/ReviewDataAgent';
import { BusinessDataAgent } from 'src/DataLayer/DataAgents/BusinessDataAgent';
import { UserNotificationDataAgent } from 'src/DataLayer/DataAgents/UserNotificationDataAgent';
import { NotificationSettingsDataAgent } from 'src/DataLayer/DataAgents/NotificationSettingsDataAgent';
import { UserPersonalizationDataAgent } from 'src/DataLayer/DataAgents/UserPersonalizationDataAgent';
import { FileRepository } from './FileRepository';
import { IAdminOverview } from 'src/DataLayer/Abstracts/Interfaces/IAdminOverview';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
@Injectable()
export class UserRepository {
  constructor(
    private readonly userDataAgent: UserDataAgent,
    private readonly userSessionDataAgent: UserSessionDataAgent,
    private readonly favoriteDataAgent: FavoriteDataAgent,
    private readonly reviewDataAgent: ReviewDataAgent,
    private readonly businessDataAgent: BusinessDataAgent,
    private readonly notificationDataAgent: UserNotificationDataAgent,
    private readonly notificaitonSettingDataAgent: NotificationSettingsDataAgent,
    private readonly personalizationDataAgent: UserPersonalizationDataAgent,
    private readonly fileRepository: FileRepository,
  ) {}

  async createUserAsync(data: CreateUserDto): Promise<BukkaResponse<User>> {
    const existingUser = await this.userDataAgent.getUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists!');
    }
    data.confirmationCode = Generator.GenerateDigits(6).toString();
    data.confirmationCodeExpires = Generator.CalculateExpirationTime(30);
    const user = data as User;
    const result = await this.userDataAgent.createUserAsync(user);
    return BukkaResponse.CustomResponse(
      `We've sent a verification token to ${result.email}. Check your Inbox or Spam for further actions.`,
      HttpStatus.CREATED,
      true,
      result,
    );
  }

  async findUserById(userId: number) {
    return this.userDataAgent.getUserById(userId);
  }

  async getLoggedInUserData() {
    const user = await UserHelper.getLoggedInUser();
    return handleCache(
      'user:profile',
      { id: user.id },
      () => this.userDataAgent.getUserById(user.id),
      CacheTTLPolicyEnum.PROFILE,
    );
  }

  async findUserByToken(token: string, type: TokenTypeEnum) {
    return this.userDataAgent.getUserByToken(token, type);
  }

  async findAdminUserById(userId: number) {
    return this.userDataAgent.getAdminUserById(userId);
  }

  async findAdminUserByRole() {
    return this.userDataAgent.getAdminUserByRole();
  }

  async findUserByEmail(email: string) {
    return this.userDataAgent.getUserByEmail(email);
  }

  async updateOtherUserAsync(
    userId: number,
    data: Partial<User>,
  ): Promise<BukkaResponse<User>> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const updatedUser = await this.userDataAgent.updateUser(userId, data);
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

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    const updatedUser = await this.userDataAgent.updateUser(
      loggedInUser?.id,
      cleanData,
    );
    await invalidateCache('user:profile', { id: loggedInUser.id });
    await invalidateCache('users:list', {});

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
    const updatedUser = await this.userDataAgent.updateUser(
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
    const updatedUser = await this.userDataAgent.updateUser(
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
    const updatedUser = await this.userDataAgent.updateUser(
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
    if (user.role === UserRoleEnum.ADMIN) {
      throw new ConflictException(
        'Cannot delete the administrator account. Only super admin can perform this action!',
      );
    }

    await this.userSessionDataAgent.deleteAllUserSessions(userId);
    await this.favoriteDataAgent.deleteAllUserFavorites(userId);
    await this.reviewDataAgent.deleteAllUserReviews(userId);
    await this.businessDataAgent.deleteAllUserBusinesses(userId);
    await this.notificationDataAgent.deleteAllUserNotifications(userId);
    await this.notificaitonSettingDataAgent.deleteUserNotificationSettings(
      userId,
    );
    await this.fileRepository.deleteAllUserFiles(userId);
    await this.personalizationDataAgent.deleteUserPersonalization(userId);
    await this.userDataAgent.deleteUser(user?.id as number);
    await invalidateCache('users:list', {});
    await invalidateCache('users:admin', {});
    await invalidateCache('user:profile', { id: userId });

    // TODO : INVALIDATE OTHER CACHES ABOVE

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
      () => this.userDataAgent.getUsersByFilter(query, pageSize, pageNumber),
      CacheTTLPolicyEnum.USER_LIST,
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
        this.userDataAgent.adminGetUsersByFilter(query, pageSize, pageNumber),
      CacheTTLPolicyEnum.USER_LIST,
    );
  }

  async getUserActivitiesSummary() {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const result = await this.userDataAgent.getUserActivitiesSummary(
      loggedInUser?.id,
    );
    return result;
  }

  async getAdminOverview(): Promise<IAdminOverview> {
    const overview = await this.userDataAgent.getAdminOverview();

    const [userGrowthData, businessStatus, orderDataRaw, recentActivitiesRaw] =
      await Promise.all([
        this.userDataAgent.getMonthlyUserRegistrations(6),
        this.userDataAgent.getBusinessStatusDistribution(),
        this.userDataAgent.getOrdersPerDay(7),
        this.userDataAgent.getRecentActivities(6),
      ]);

    // Build stats array (format values nicely; you can add change calculations if you want)
    const stats = [
      {
        title: 'Total Users',
        value: Intl.NumberFormat().format((overview.totalUsers as number) ?? 0),
        change: undefined,
        positive: true,
      },
      {
        title: 'Active Businesses',
        value: Intl.NumberFormat().format(
          businessStatus.find((b) => b.name === 'Active')?.value ?? 0,
        ),
        change: undefined,
        positive: true,
      },
      {
        title: 'Total Orders',
        value: Intl.NumberFormat().format(
          orderDataRaw.reduce((s, d) => s + d.orders, 0),
        ),
        change: undefined,
        positive: true,
      },
      {
        title: 'Revenue',
        value: '₦0', // revenue isn't available in the user data agent; replace with real source if available
        change: undefined,
        positive: true,
      },
    ];

    // Add colors (frontend uses CSS variables; provide css variable strings)
    const businessCategoryData = businessStatus.map((b, i) => ({
      ...b,
      color:
        i === 0
          ? 'hsl(var(--primary))'
          : i === 1
            ? 'hsl(var(--accent))'
            : 'hsl(var(--destructive))',
    }));

    const orderData = orderDataRaw.map((d) => ({
      day: d.day,
      orders: d.orders,
    }));

    const recentActivity = recentActivitiesRaw.map((a) => ({
      action: a.action,
      user: a.user,
      // formatted relative time - you can compute actual "2 minutes ago" on frontend; here provide ISO
      time: a.time.toISOString(),
    }));

    return {
      stats,
      userGrowthData,
      businessCategoryData,
      orderData,
      recentActivity,
      others: overview,
    } as IAdminOverview;
  }

  async getVendorOverview(): Promise<IAdminOverview> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    if (loggedInUser?.role !== UserRoleEnum.VENDOR) {
      throw new UnauthorizedException('You are not authorized');
    }

    const overview = await this.userDataAgent.getAdminOverview();

    const [userGrowthData, businessStatus, orderDataRaw, recentActivitiesRaw] =
      await Promise.all([
        this.userDataAgent.getMonthlyUserRegistrations(6),
        this.userDataAgent.getBusinessStatusDistribution(),
        this.userDataAgent.getOrdersPerDay(7),
        this.userDataAgent.getRecentActivities(6),
      ]);

    // Build stats array (format values nicely; you can add change calculations if you want)
    const stats = [
      {
        title: 'Total Users',
        value: Intl.NumberFormat().format((overview.totalUsers as number) ?? 0),
        change: undefined,
        positive: true,
      },
      {
        title: 'Active Businesses',
        value: Intl.NumberFormat().format(
          businessStatus.find((b) => b.name === 'Active')?.value ?? 0,
        ),
        change: undefined,
        positive: true,
      },
      {
        title: 'Total Orders',
        value: Intl.NumberFormat().format(
          orderDataRaw.reduce((s, d) => s + d.orders, 0),
        ),
        change: undefined,
        positive: true,
      },
      {
        title: 'Revenue',
        value: '₦0', // revenue isn't available in the user data agent; replace with real source if available
        change: undefined,
        positive: true,
      },
    ];

    // Add colors (frontend uses CSS variables; provide css variable strings)
    const businessCategoryData = businessStatus.map((b, i) => ({
      ...b,
      color:
        i === 0
          ? 'hsl(var(--primary))'
          : i === 1
            ? 'hsl(var(--accent))'
            : 'hsl(var(--destructive))',
    }));

    const orderData = orderDataRaw.map((d) => ({
      day: d.day,
      orders: d.orders,
    }));

    const recentActivity = recentActivitiesRaw.map((a) => ({
      action: a.action,
      user: a.user,
      // formatted relative time - you can compute actual "2 minutes ago" on frontend; here provide ISO
      time: a.time.toISOString(),
    }));

    return {
      stats,
      userGrowthData,
      businessCategoryData,
      orderData,
      recentActivity,
      others: overview,
    } as IAdminOverview;
  }

  async getUserOverview(): Promise<IAdminOverview> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    if (loggedInUser?.role !== UserRoleEnum.USER) {
      throw new UnauthorizedException('You are not authorized');
    }

    const overview = await this.userDataAgent.getAdminOverview();

    const [userGrowthData, businessStatus, orderDataRaw, recentActivitiesRaw] =
      await Promise.all([
        this.userDataAgent.getMonthlyUserRegistrations(6),
        this.userDataAgent.getBusinessStatusDistribution(),
        this.userDataAgent.getOrdersPerDay(7),
        this.userDataAgent.getRecentActivities(6),
      ]);

    // Build stats array (format values nicely; you can add change calculations if you want)
    const stats = [
      {
        title: 'Total Users',
        value: Intl.NumberFormat().format((overview.totalUsers as number) ?? 0),
        change: undefined,
        positive: true,
      },
      {
        title: 'Active Businesses',
        value: Intl.NumberFormat().format(
          businessStatus.find((b) => b.name === 'Active')?.value ?? 0,
        ),
        change: undefined,
        positive: true,
      },
      {
        title: 'Total Orders',
        value: Intl.NumberFormat().format(
          orderDataRaw.reduce((s, d) => s + d.orders, 0),
        ),
        change: undefined,
        positive: true,
      },
      {
        title: 'Revenue',
        value: '₦0', // revenue isn't available in the user data agent; replace with real source if available
        change: undefined,
        positive: true,
      },
    ];

    // Add colors (frontend uses CSS variables; provide css variable strings)
    const businessCategoryData = businessStatus.map((b, i) => ({
      ...b,
      color:
        i === 0
          ? 'hsl(var(--primary))'
          : i === 1
            ? 'hsl(var(--accent))'
            : 'hsl(var(--destructive))',
    }));

    const orderData = orderDataRaw.map((d) => ({
      day: d.day,
      orders: d.orders,
    }));

    const recentActivity = recentActivitiesRaw.map((a) => ({
      action: a.action,
      user: a.user,
      // formatted relative time - you can compute actual "2 minutes ago" on frontend; here provide ISO
      time: a.time.toISOString(),
    }));

    return {
      stats,
      userGrowthData,
      businessCategoryData,
      orderData,
      recentActivity,
      others: overview,
    } as IAdminOverview;
  }
}
