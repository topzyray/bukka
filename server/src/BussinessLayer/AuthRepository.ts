import { UserRepository } from './UserRepository';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  SigninDto,
  LoginResponseDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  RefreshTokenResponseDto,
  SigninMetaDataDto,
} from 'src/DomainLayer/Dtos/AuthDto';
import { User } from 'src/DomainLayer/Models/User';
import { CreateUserDto } from 'src/DomainLayer/Dtos/UserDto';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';
import { UserStatusEnum } from 'src/DomainLayer/Enums/UserStatusEnum';
import { TokenRepository } from './TokenRepository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';
import { UserWithCounts } from 'src/DomainLayer/Models/UserWithCounts';
import { NotificationSettingsDataAgent } from 'src/DataLayer/DataAgents/NotificationSettingsDataAgent';
import { AuthQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/AuthQueueMessageTypeEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { AppUrlTypeEnum } from 'src/DomainLayer/Enums/AppUrlTypeEnum';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { UserSessionRepository } from './UserSessionRepository';
import { UserSession } from 'src/DomainLayer/Models/UserSession';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { QueueService } from 'src/InfrastructureLayer/Services/queue/QueueService';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import { ProfileQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/ProfileQueueMessageTypeEnum';
import { SocialAccountDataAgent } from 'src/DataLayer/DataAgents/SocialAccountDataAgent';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userSessionRepository: UserSessionRepository,
    private readonly _tokenRepository: TokenRepository,
    private readonly _queue: QueueService,
    private readonly _notifSetting: NotificationSettingsDataAgent,
    private readonly _configService: AppConfigurationService,
    private readonly _socialAccountAgent: SocialAccountDataAgent,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<BukkaResponse<User>> {
    const hashedPassword = await Generator.Hash(userDto.password, 10);
    userDto.password = hashedPassword;
    const data = await this._userRepository.createUserAsync(userDto);

    if (data.status) {
      const newSettings = {
        userId: data?.responseData?.id,
        settings: {
          isEmailTurnedOn: true,
          isInAppTurnedOn: true,
          isPushTurnedOn: true,
        },
      };
      await this._notifSetting.createNotificationSetting(newSettings);

      this._queue.publishToQueue(
        QueueEnum.AUTH_NOTIFICATION,
        {
          messageType: AuthQueueMessageTypeEnum.CONFIRM_EMAIL,
          payload: {
            userId: data?.responseData?.id,
            email: data?.responseData?.email,
            firstName: data?.responseData?.firstName,
            confirmationCode: data?.responseData?.confirmationCode,
            confirmationCodeExpires:
              data?.responseData?.confirmationCodeExpires,
          },
        },
        {
          provider: QueueProviderEnum.BULLMQ,
        },
      );
    }
    const mappedData = TypeSafeMapper.mapObject(data?.responseData, {
      exclude: ['password'],
    });
    return { ...data, responseData: mappedData };
  }

  async signIn(
    loginDto: SigninDto,
    metaData: SigninMetaDataDto,
  ): Promise<BukkaResponse<LoginResponseDto<User>>> {
    const user = (await this._userRepository.findUserByEmail(
      loginDto.email,
    )) as UserWithCounts;

    if (!user || !(await this.validateUserAsync(user, loginDto.password))) {
      return BukkaResponse.ErrorResponse(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user?.emailConfirmed) {
      return BukkaResponse.LoginResponse(
        'user',
        user,
        false,
        'Email verification required!',
      );
    }

    if (user?.userStatus === UserStatusEnum.LOCKED) {
      return BukkaResponse.LoginResponse(
        'user',
        user,
        false,
        'Your account has been locked. Please contact support.',
      );
    }

    const claims = TypeSafeMapper.mapObject(user, {
      include: ['id', 'email', 'firstName', 'lastName', 'role'],
    }) as TokenClaims;

    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);
    const refreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();

    const deviceId = Generator.RandomUUID();
    const encryptedToken = await Generator.Encrypt(refreshToken);

    const existingSessions =
      await this._userSessionRepository.findUserSessionBy(user?.id);

    if (existingSessions.length >= this._configService.maxSessionCount) {
      const sorted = existingSessions.sort(
        (a: UserSession, b: UserSession) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const toDelete = sorted.slice(
        0,
        existingSessions.length - (this._configService.maxSessionCount - 1),
      );
      await Promise.all(
        toDelete.map((s) =>
          this._userSessionRepository.deleteSessionById(s.id),
        ),
      );
    }

    await this._userSessionRepository.createUserSession({
      userId: user.id,
      deviceId: deviceId,
      refreshToken: encryptedToken,
      userAgent: metaData.userAgent,
      ipAddress: metaData.ip,
      expiresAt: Generator.CalculateExpirationTime(20160), // 14 days
    });

    await this._userRepository.updateOtherUserAsync(user?.id, {
      lastLoginAt: new Date(),
    });

    const LoginResponse = new LoginResponseDto();
    LoginResponse.user = TypeSafeMapper.mapObject(user, {
      exclude: ['password', 'locationId'],
    });
    LoginResponse.accessToken = accessToken;
    LoginResponse.refreshToken = refreshToken;
    LoginResponse.deviceId = deviceId;

    const firstName = TextHelper.capitalize(user?.firstName);

    return BukkaResponse.LoginResponse(
      'User',
      LoginResponse,
      true,
      `Welcome back, ${firstName} 👋`,
    );
  }

  async signInWithSocial(
    profile: {
      provider: string;
      providerId: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      profile?: any;
    },
    metaData: SigninMetaDataDto,
  ): Promise<BukkaResponse<LoginResponseDto<User>>> {
    console.log('PROFILE IN AUTH REPO: ', profile);

    let social = await this._socialAccountAgent.findByProvider(
      profile.provider,
      profile.providerId,
    );
    let user: User | null = null;

    if (social) {
      user = await this._userRepository.findUserById(social.userId);
    } else {
      if (profile?.email) {
        user = await this._userRepository.findUserByEmail(profile?.email);
      }

      if (!user) {
        const randomPasswordHash = await Generator.Hash(
          Generator.GenerateSecurePassword(),
          10,
        );
        user = await this._userRepository.createUserFromSocial({
          email:
            profile.email ??
            `${profile.provider}-${profile.providerId}@noemail.local`,
          password: randomPasswordHash,
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          emailConfirmed: true,
          userStatus: UserStatusEnum.ACTIVE,
        });

        await this._notifSetting.createNotificationSetting({
          userId: user.id,
          settings: {
            isEmailTurnedOn: true,
            isInAppTurnedOn: true,
            isPushTurnedOn: true,
          },
        });
      }

      await this._socialAccountAgent.create({
        provider: profile?.provider,
        providerId: profile?.providerId,
        userId: user?.id,
        profileJson: profile?.profile ?? null,
      });
    }

    const claims = TypeSafeMapper.mapObject(user as User, {
      include: ['id', 'email', 'firstName', 'lastName', 'role'],
    }) as TokenClaims;

    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);
    const refreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();
    const deviceId = Generator.RandomUUID();
    const encryptedToken = await Generator.Encrypt(refreshToken);

    // session cleanup logic reused
    const existingSessions =
      await this._userSessionRepository.findUserSessionBy(user?.id as number);

    if (existingSessions.length >= this._configService.maxSessionCount) {
      const sorted = existingSessions?.sort(
        (a: UserSession, b: UserSession) =>
          new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime(),
      );
      const toDelete = sorted.slice(
        0,
        existingSessions?.length - (this._configService.maxSessionCount - 1),
      );
      await Promise.all(
        toDelete.map((s) =>
          this._userSessionRepository.deleteSessionById(s.id),
        ),
      );
    }

    await this._userSessionRepository.createUserSession({
      userId: user?.id as number,
      deviceId,
      refreshToken: encryptedToken,
      userAgent: metaData.userAgent,
      ipAddress: metaData.ip,
      expiresAt: Generator.CalculateExpirationTime(20160),
    });

    await this._userRepository.updateOtherUserAsync(user?.id as number, {
      lastLoginAt: new Date(),
    });

    const response = new LoginResponseDto();
    response.user = TypeSafeMapper.mapObject(user as User, {
      exclude: ['password', 'locationId'],
    });
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.deviceId = deviceId;

    const first = TextHelper.capitalize(user?.firstName);
    return BukkaResponse.LoginResponse(
      'User',
      response,
      true,
      `Welcome back, ${first} 👋`,
    );
  }

  async signOut(
    refreshToken: string,
  ): Promise<BukkaResponse<RefreshTokenResponseDto>> {
    const encryptedToken = await Generator.Encrypt(refreshToken);
    const session =
      await this._userSessionRepository.findByRefreshToken(encryptedToken);

    if (!session) {
      return BukkaResponse.ErrorResponse(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (new Date(session?.expiresAt) < new Date()) {
      await this._userSessionRepository.deleteSessionById(session.id);
      return BukkaResponse.ErrorResponse(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this._userSessionRepository.deleteSessionByUserIdAndDeviceId(
      session?.userId,
      session?.deviceId,
    );

    return BukkaResponse.CustomResponse(
      'User signed out successfully',
      HttpStatus.OK,
      true,
      null,
    );
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<BukkaResponse<RefreshTokenResponseDto>> {
    const encryptedToken = await Generator.Encrypt(refreshToken);

    const session =
      await this._userSessionRepository.findByRefreshToken(encryptedToken);

    if (!session || new Date(session.expiresAt) < new Date()) {
      return BukkaResponse.ErrorResponse(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this._userRepository.findUserById(session.userId);
    const claims = {
      id: user?.id as number,
      email: user?.email as string,
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      role: user?.role as string,
    };
    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);
    const newRefreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();

    session.refreshToken = await Generator.Encrypt(newRefreshToken);
    session.expiresAt = Generator.CalculateExpirationTime(20160);
    await this._userSessionRepository.updateUserSession(session.id, session);

    return BukkaResponse.GetSingleDataResponse('Token', {
      accessToken,
      refreshToken: newRefreshToken,
      deviceId: session.deviceId,
    });
  }

  async forgotPassword(
    forgotPassword: ForgotPasswordDto,
  ): Promise<BukkaResponse<User>> {
    const user = await this._userRepository.findUserByEmail(
      forgotPassword.email,
    );

    if (!user) {
      return BukkaResponse.GetSingleDataResponse('User', user);
    }

    if (!user?.emailConfirmed) {
      return BukkaResponse.ErrorResponse('Email not verified!');
    }

    const stillValid =
      user.passwordResetToken &&
      user.passwordResetExpires &&
      new Date() < new Date(user.passwordResetExpires);

    const passwordResetToken = stillValid
      ? user.passwordResetToken
      : await this._tokenRepository.generatePasswordResetTokenAsync();

    const expiresAt = stillValid
      ? user.passwordResetExpires
      : Generator.CalculateExpirationTime(10);

    const result = await this._userRepository.updateOtherUserAsync(
      user.id as number,
      {
        passwordResetToken,
        passwordResetExpires: Generator.CalculateExpirationTime(10),
      },
    );

    if (!result) {
      return BukkaResponse.CustomResponse(
        'Unable to process your request!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this._queue.publishToQueue(
      QueueEnum.AUTH_NOTIFICATION,
      {
        messageType: AuthQueueMessageTypeEnum.FORGOT_PASSWORD,
        payload: {
          userId: result?.responseData?.id,
          email: result?.responseData?.email,
          firstName: result?.responseData?.firstName,
          passwordResetToken: result?.responseData?.passwordResetToken,
          passwordResetExpires: `${TextHelper.getFormattedDate(expiresAt?.toString() as string)} at ${TextHelper.getFormattedTime(expiresAt?.toString() as string)}`,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    const mappedData = TypeSafeMapper.mapObject(result?.responseData, {
      exclude: ['password'],
    });

    return BukkaResponse.CustomResponse(
      `We've sent a password reset token to ${result.responseData.email}. Check your Inbox or Spam for further instructions.`,
      HttpStatus.OK,
      true,
      mappedData,
    );
  }

  async resetPassword(data: ResetPasswordDto): Promise<BukkaResponse<User>> {
    const user = await this._userRepository.findUserByToken(
      data.token,
      TokenTypeEnum.PASSWORD_RESET,
    );

    if (!user) {
      return BukkaResponse.ErrorResponse(
        'Token not found. Please request a new one!',
        HttpStatus.NOT_FOUND,
      );
    }

    const expiresAt =
      user?.passwordResetExpires instanceof Date
        ? user?.passwordResetExpires.getTime()
        : Number(user?.passwordResetExpires);

    if (!expiresAt || Date.now() > expiresAt) {
      return BukkaResponse.CustomResponse(
        'This token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.updatePassword(user, data.newPassword);
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<BukkaResponse<User>> {
    const loggedInUser = await UserHelper.getLoggedInUser();

    const response = await this._userRepository.findUserById(loggedInUser.id);

    if (!response) {
      return BukkaResponse.LoginResponse(
        'User',
        response,
        false,
        'User does not exist',
      );
    }

    const validUser = await this.validateUserAsync(
      response,
      changePasswordDto.currentPassword,
    );

    if (!validUser) {
      return BukkaResponse.LoginResponse(
        'User',
        response,
        false,
        'Incorrect Current Password',
      );
    }

    return await this.updatePassword(response, changePasswordDto.newPassword);
  }

  async resendConfirmationEmail(
    confirmEmailDto: ResendConfirmEmailDto,
  ): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserByEmail(
      confirmEmailDto.email,
    );

    if (!response) {
      return BukkaResponse.CustomResponse(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response.emailConfirmed) {
      return BukkaResponse.CustomResponse(
        'Your email has already been verified. You can now log in.',
        HttpStatus.BAD_REQUEST,
        true,
        null,
      );
    }

    response.confirmationCode = Generator.GenerateDigits(6).toString();
    response.confirmationCodeExpires = Generator.CalculateExpirationTime(30);

    const data = await this._userRepository.updateOtherUserAsync(
      response.id as number,
      {
        confirmationCode: response.confirmationCode,
        confirmationCodeExpires: response.confirmationCodeExpires,
      },
    );

    if (data.status) {
      this._queue.publishToQueue(
        QueueEnum.AUTH_NOTIFICATION,
        {
          messageType: AuthQueueMessageTypeEnum.RESEND_CONFIRMATION_EMAIL,
          payload: {
            userId: data?.responseData?.id,
            email: data?.responseData?.email,
            firstName: data?.responseData?.firstName,
            confirmationCode: data?.responseData?.confirmationCode,
            confirmationCodeExpires:
              data?.responseData?.confirmationCodeExpires,
          },
        },
        {
          provider: QueueProviderEnum.BULLMQ,
        },
      );
    }

    return BukkaResponse.CustomResponse(
      `Confirmation Email Sent Successfully to ${confirmEmailDto.email}. Check your Inbox or Spam for further actions.`,
      HttpStatus.OK,
      true,
      null,
    );
  }

  async verifyEmail(
    confirmationDto: ConfirmEmailDto,
  ): Promise<BukkaResponse<User>> {
    const user = await this._userRepository.findUserByToken(
      confirmationDto.token,
      TokenTypeEnum.CONFIRMATION,
    );

    if (!user) {
      return BukkaResponse.CustomResponse(
        'Token does not exist. Please request new one!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailConfirmed) {
      return BukkaResponse.CustomResponse(
        'Email verification successfull. Please signin.',
        HttpStatus.BAD_REQUEST,
        true,
        null,
      );
    }

    if (
      !user.confirmationCodeExpires ||
      Date.now() > Number(user.confirmationCodeExpires)
    ) {
      return BukkaResponse.CustomResponse(
        'This token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (confirmationDto.token !== user.confirmationCode) {
      return BukkaResponse.CustomResponse(
        'Invalid confirmation code',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.userStatus = UserStatusEnum.ACTIVE;
    user.emailConfirmed = true;
    user.confirmationCode = null;
    user.confirmationCodeExpires = null;

    const result = await this._userRepository.updateOtherUserAsync(
      user.id as number,
      {
        userStatus: user.userStatus,
        emailConfirmed: user.emailConfirmed,
        confirmationCode: user.confirmationCode,
        confirmationCodeExpires: user.confirmationCodeExpires,
      },
    );

    if (!result?.status) {
      return BukkaResponse.ErrorResponse(
        'Verification failed! Please try again.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    this._queue.publishToQueue(
      QueueEnum.AUTH_NOTIFICATION,
      {
        messageType: AuthQueueMessageTypeEnum.SIGNUP,
        payload: {
          userId: result?.responseData?.id,
          email: result?.responseData?.email,
          firstName: result?.responseData?.firstName,
          getStartedLink:
            this._configService.nodeEnv === EnvironmentTypeEnum.DEV
              ? AppUrlTypeEnum.CLIENT_DEV
              : AppUrlTypeEnum.CLIENT_PROD,
          userType: result?.responseData?.userType,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    return BukkaResponse.CustomResponse(
      'Email verification successful! Please signin.',
      HttpStatus.OK,
      true,
      null,
    );
  }

  private async updatePassword(
    user: User,
    newPassword: string,
  ): Promise<BukkaResponse<User>> {
    const hashedPassword = await Generator.Hash(newPassword, 10);
    user.password = hashedPassword;
    const result = await this._userRepository.updateOtherUserAsync(
      user.id as number,
      {
        password: user.password,
        passwordChangedAt: new Date(),
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    );

    if (!result.status) {
      return BukkaResponse.CustomResponse(
        'Unable to change password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const mappedData = TypeSafeMapper.mapObject(result?.responseData, {
      exclude: ['password'],
    });

    this._queue.publishToQueue(
      QueueEnum.PROFILE_NOTIFICATION,
      {
        messageType: ProfileQueueMessageTypeEnum.PASSWORD_CHANGE,
        payload: {
          userId: result?.responseData?.id,
          email: result?.responseData?.email,
          firstName: result?.responseData?.firstName,
          lastName: result?.responseData?.lastName,
          role: result?.responseData?.role,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    return BukkaResponse.CustomResponse(
      'Password reset/updated successfully!',
      HttpStatus.OK,
      true,
      mappedData,
    );
  }

  private async validateUserAsync(
    user: User,
    password: string,
  ): Promise<User | null> {
    if (
      user &&
      (await ValidationHelper.validatePassword(password, user.password)) ===
        true
    ) {
      return user;
    }
    return null;
  }
}
