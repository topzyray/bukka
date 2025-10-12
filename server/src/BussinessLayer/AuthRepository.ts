import { UserRepository } from './UserRepository';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  SigninDto,
  LoginResponseDto,
  RefreshTokenDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  RefreshTokenResponseDto,
} from 'src/DomainLayer/Dtos/AuthDto';
import { User } from 'src/DomainLayer/Models/User';
import { CreateUserDto, UserDto } from 'src/DomainLayer/Dtos/UserDto';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';
import { UserStatusEnum } from 'src/DomainLayer/Enums/UserStatusEnum';
import { TokenRepository } from './TokenRepository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';
import { UserWithCounts } from 'src/DomainLayer/Models/UserWithCounts';
import { AuthNotificationService } from 'src/InfrastructureLayer/Services/notification/auth/AuthNotificationService';
import { NotificationSettingsDataAgent } from 'src/DataLayer/DataAgents/NotificationSettingsDataAgent';
import { AuthQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/AuthQueueEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { AppUrlTypeEnum } from 'src/DomainLayer/Enums/AppUrlTypeEnum';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _tokenRepository: TokenRepository,
    private readonly _notif: AuthNotificationService,
    private readonly _notifSetting: NotificationSettingsDataAgent,
    private readonly _configService: AppConfigurationService,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<BukkaResponse<User>> {
    const hashedPassword = await Generator.hash(userDto.password, 10);
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

      this._notif.processAccountConfirmation(
        {
          userId: data?.responseData?.id,
          email: data?.responseData?.email,
          firstName: data?.responseData?.firstName,
          confirmationCode: data?.responseData?.confirmationCode,
          confirmationCodeExpires: data?.responseData?.confirmationCodeExpires,
        },
        AuthQueueMessageTypeEnum.SIGNUP,
      );
    }
    const mappedData = TypeSafeMapper.map(
      data?.responseData,
      UserResponse,
      UserDto,
    );
    return { ...data, responseData: mappedData };
  }

  async signIn(loginDto: SigninDto): Promise<BukkaResponse<LoginResponseDto>> {
    const response = (await this._userRepository.findUserByEmail(
      loginDto.email,
    )) as UserWithCounts;
    if (!response) {
      return BukkaResponse.loginResponse(
        'user',
        response,
        false,
        'Invalid Credentials!',
      );
    }
    const validUser = await this.validateUserAsync(response, loginDto.password);
    if (!validUser) {
      return BukkaResponse.loginResponse(
        'user',
        response,
        false,
        'Invalid credentials!',
      );
    }

    if (!response?.emailConfirmed) {
      return BukkaResponse.loginResponse(
        'user',
        response,
        false,
        'Email verification required!',
      );
    }

    if (response?.userStatus === UserStatusEnum.LOCKED) {
      return BukkaResponse.loginResponse(
        'user',
        response,
        false,
        'Your account has been locked. Please contact support.',
      );
    }

    const claims = TypeSafeMapper.map(response, TokenClaims, UserDto);

    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);
    const refreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();
    response.refreshToken = refreshToken;
    response.lastLoginAt = new Date();

    const loginResponse = new LoginResponseDto();

    await this._userRepository.updateOtherUserAsync(response?.id as number, {
      id: response?.id,
      refreshToken: response?.refreshToken,
      refreshTokenExpires: Generator.calculateExpirationTime(20160), // 14 days
      lastLoginAt: response?.lastLoginAt,
    });

    loginResponse.user = TypeSafeMapper.map(response, UserResponse, UserDto);

    loginResponse.accessToken = accessToken;
    loginResponse.refreshToken = response.refreshToken;
    loginResponse.counts = response?.counts;

    return BukkaResponse.loginResponse('User', loginResponse, true);
  }

  async signOut(
    refreshToken: string,
  ): Promise<BukkaResponse<RefreshTokenResponseDto>> {
    const response = await this._userRepository.findUserByToken(
      refreshToken,
      TokenTypeEnum.REFRESH_TOKEN,
    );

    if (!response) {
      return BukkaResponse.errorResponse(
        'Invalid Refresh Token, Please Re-Login',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this._userRepository.updateOtherUserAsync(response.id as number, {
      refreshToken: null,
      refreshTokenExpires: null,
    });

    return BukkaResponse.customResponse(
      'User signed out successfully',
      HttpStatus.OK,
      true,
      null,
    );
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<BukkaResponse<RefreshTokenResponseDto>> {
    // TODO: Implement the below in the future for logging purpose to detect a token replay attack
    //     if (!response) {
    //   // Potential token replay attack
    //   await this._userRepository.flagSuspiciousActivity(userId);
    //   return BukkaResponse.errorResponse('Invalid Refresh Token', HttpStatus.UNAUTHORIZED);
    // }

    const response = await this._userRepository.findUserByToken(
      refreshToken,
      TokenTypeEnum.REFRESH_TOKEN,
    );

    if (!response) {
      return BukkaResponse.errorResponse(
        'Invalid Refresh Token, Please Re-Login',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (response.refreshToken !== refreshToken) {
      return BukkaResponse.errorResponse(
        'Invalid Refresh Token, Please Re-Login',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (
      !response.refreshTokenExpires ||
      Date.now() > Number(response.refreshTokenExpires)
    ) {
      return BukkaResponse.errorResponse(
        'Refresh token expired. Please Re-Login.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Enable and implement this if you want to implement more security hardening, session lifetime control and some compliance
    // if (user.refreshTokenRotationCount >= user.maxRotationCount) {
    //   return BukkaResponse.errorResponse(
    //     'Session expired. Please login again.',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // user.refreshTokenRotationCount += 1;
    // await this._userRepository.updateOtherUserAsync(user.id, {
    //   refreshToken: newRefreshToken,
    //   refreshTokenExpires: newExpiry,
    //   refreshTokenRotationCount: user.refreshTokenRotationCount,
    // });

    const claims = {
      id: response.id as number,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
    };

    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);

    response.refreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();

    await this._userRepository.updateOtherUserAsync(response.id as number, {
      refreshToken: response.refreshToken,
      refreshTokenExpires: Generator.calculateExpirationTime(20160), // 14 days
    });

    return BukkaResponse.GetSingleDataResponse('Token', {
      accessToken,
      refreshToken: response.refreshToken,
    });
  }

  async forgotPassword(
    forgotPassword: ForgotPasswordDto,
  ): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserByEmail(
      forgotPassword.email,
    );

    if (!response) {
      return BukkaResponse.GetSingleDataResponse('User', response);
    }

    if (!response?.emailConfirmed) {
      return BukkaResponse.loginResponse(
        'user',
        response,
        false,
        'You have not verified your email!',
      );
    }

    response.passwordResetToken =
      await this._tokenRepository.generatePasswordResetTokenAsync();

    const result = await this._userRepository.updateOtherUserAsync(
      response.id as number,
      {
        passwordResetToken: response.passwordResetToken,
        passwordResetExpires: new Date(),
      },
    );

    if (!result) {
      return BukkaResponse.customResponse(
        'Unable to process your request!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this._notif.processPasswordReset(
      {
        userId: result?.responseData?.id,
        email: result?.responseData?.email,
        firstName: result?.responseData?.firstName,
        passwordResetToken: result?.responseData?.passwordResetToken,
        passwordResetExpires:
          `${TextHelper.getFormattedDate(result?.responseData?.passwordResetExpires)} at ${TextHelper.getFormattedTime(result?.responseData?.passwordResetExpires)}` as unknown as Date,
      },
      AuthQueueMessageTypeEnum.FORGOT_PASSWORD,
    );

    const mappedData = TypeSafeMapper.map(
      result?.responseData,
      UserResponse,
      UserDto,
    );

    return BukkaResponse.customResponse(
      `We've sent a password reset link to ${result.responseData.email}. Check your Inbox or Spam for further actions.`,
      HttpStatus.OK,
      true,
      mappedData,
    );
  }

  async resetPassword(data: ResetPasswordDto): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserByToken(
      data.token,
      TokenTypeEnum.PASSWORD_RESET,
    );

    if (!response) {
      return BukkaResponse.errorResponse(
        'Token not found. Please request a new one!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (response.passwordResetToken !== data.token) {
      return BukkaResponse.errorResponse(
        'Token not found. Please request a new one!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      !response.passwordResetExpires ||
      Date.now() > Number(response.passwordResetExpires)
    ) {
      return BukkaResponse.customResponse(
        'This token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.updatePassword(response, data.newPassword);
  }

  async changePassword(
    changePassword: ChangePasswordDto,
  ): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserById(
      changePassword.userId,
    );

    if (!response) {
      return BukkaResponse.loginResponse(
        'User',
        response,
        false,
        'User does not exist',
      );
    }

    const validUser = await this.validateUserAsync(
      response,
      changePassword.currentPassword,
    );

    if (!validUser) {
      return BukkaResponse.loginResponse(
        'User',
        response,
        false,
        'Incorrect Current Password',
      );
    }

    return await this.updatePassword(response, changePassword.newPassword);
  }

  async resendConfirmationEmail(
    confirmEmailDto: ResendConfirmEmailDto,
  ): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserByEmail(
      confirmEmailDto.email,
    );

    if (!response) {
      return BukkaResponse.customResponse(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response.emailConfirmed) {
      return BukkaResponse.customResponse(
        'Your email has already been verified. You can now log in.',
        HttpStatus.BAD_REQUEST,
        true,
        null,
      );
    }

    response.confirmationCode = Generator.GenerateDigits(6).toString();
    response.confirmationCodeExpires = Generator.calculateExpirationTime(30);

    const data = await this._userRepository.updateOtherUserAsync(
      response.id as number,
      {
        confirmationCode: response.confirmationCode,
        confirmationCodeExpires: response.confirmationCodeExpires,
      },
    );

    if (data.status) {
      this._notif.processResendConfirmation(
        {
          userId: data?.responseData?.id,
          email: data?.responseData?.email,
          firstName: data?.responseData?.firstName,
          confirmationCode: data?.responseData?.confirmationCode,
          confirmationCodeExpires: data?.responseData?.confirmationCodeExpires,
        },
        AuthQueueMessageTypeEnum.RESEND_CONFIRMATION_EMAIL,
      );
    }

    return BukkaResponse.customResponse(
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
      return BukkaResponse.customResponse(
        'Token does not exist. Please request new one!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailConfirmed) {
      return BukkaResponse.customResponse(
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
      return BukkaResponse.customResponse(
        'This token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (confirmationDto.token !== user.confirmationCode) {
      return BukkaResponse.customResponse(
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
      return BukkaResponse.errorResponse(
        'Verification failed! Please try again.',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    this._notif.processSignupWelcome(
      {
        userId: result?.responseData?.id,
        email: result?.responseData?.email,
        firstName: result?.responseData?.firstName,
        getStartedLink:
          this._configService.nodeEnv === EnvironmentTypeEnum.DEV
            ? AppUrlTypeEnum.LOCAL
            : AppUrlTypeEnum.PROD,
        userType: result?.responseData?.userType,
      },
      AuthQueueMessageTypeEnum.SIGNUP,
    );

    return BukkaResponse.customResponse(
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
    const hashedPassword = await Generator.hash(newPassword, 10);
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
      return BukkaResponse.customResponse(
        'Unable to change password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const mappedData = TypeSafeMapper.map(
      result?.responseData,
      UserResponse,
      UserDto,
    );

    return BukkaResponse.customResponse(
      'Password reset successful. You can now signin with your new password!',
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
