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
} from 'src/DomainLayer/Dtos/AuthDto';
import { CreateUserDto, UserDto } from 'src/DomainLayer/Dtos/UserDto';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';
import { UserStatusEnum } from 'src/DomainLayer/Enums/UserStatusEnum';
import { TokenRepository } from './TokenRepository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';
import { User } from 'src/DomainLayer/Models/User';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';
import { UserWithCounts } from 'src/DomainLayer/Models/UserWithCounts';
import { AuthNotificationService } from 'src/InfrastructureLayer/Services/notification/auth/AuthNotificationService';
import { NotificationSettingsDataAgent } from 'src/DataLayer/DataAgents/NotificationSettingsDataAgent';
import { AuthQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/AuthQueueEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { AppUrlTypeEnum } from 'src/DomainLayer/Enums/AppUrlTypeEnum';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';

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

      this._notif.processSignupWelcome(
        {
          userId: data?.responseData?.id,
          email: data?.responseData?.email,
          firstName: data?.responseData?.firstName,
          getStartedLink:
            this._configService.nodeEnv === EnvironmentTypeEnum.DEV
              ? AppUrlTypeEnum.LOCAL
              : AppUrlTypeEnum.PROD,
          userType: data?.responseData?.userType,
        },
        AuthQueueMessageTypeEnum.SIGNUP,
      );

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

  async signIn(loginDto: SigninDto): Promise<BukkaResponse<User>> {
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
      lastLoginAt: response?.lastLoginAt,
    });

    loginResponse.user = TypeSafeMapper.map(response, UserResponse, UserDto);

    loginResponse.accessToken = accessToken;
    loginResponse.refreshToken = response.refreshToken;
    loginResponse.counts = response?.counts;

    return BukkaResponse.loginResponse('User', loginResponse, true);
  }

  async refreshToken(
    refreshToken: RefreshTokenDto,
  ): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserById(
      refreshToken.userId,
    );

    if (!response) {
      return BukkaResponse.GetSingleDataResponse('User', response);
    }

    if (response.refreshToken !== refreshToken.oldRefreshToken) {
      return BukkaResponse.errorResponse(
        'Invalid Refresh Token, Please Re-Login',
        HttpStatus.FORBIDDEN,
      );
    }

    const claims = {
      userId: response.id as number,
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
    });

    return BukkaResponse.GetSingleDataResponse('token', {
      token: accessToken,
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
        passwordResetTokenExpires:
          `${TextHelper.getFormattedDate(result?.responseData?.passwordResetTokenExpires)} at ${TextHelper.getFormattedTime(result?.responseData?.passwordResetTokenExpires)}` as unknown as Date,
      },
      AuthQueueMessageTypeEnum.FORGOT_PASSWORD,
    );

    return BukkaResponse.customResponse(
      `We've sent a password reset link to ${result.responseData.email}. Please check your inbox and follow the instructions.`,
      HttpStatus.OK,
      true,
      response,
    );
  }

  async resetPassword(data: ResetPasswordDto): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserByEmail(data.email);

    if (!response) {
      return BukkaResponse.GetSingleDataResponse('user', response);
    }

    if (Date.now() > Number(response.passwordResetExpires)) {
      return BukkaResponse.customResponse(
        'This token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response.passwordResetToken !== data.token) {
      return BukkaResponse.GetSingleDataResponse(
        'User',
        response,
        'Invalid password reset code',
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
      `Confirmation Email Sent Successfully to ${confirmEmailDto.email}`,
      HttpStatus.OK,
      true,
      null,
    );
  }

  async verifyEmail(
    confirmationDto: ConfirmEmailDto,
  ): Promise<BukkaResponse<User>> {
    const response = await this._userRepository.findUserByEmail(
      confirmationDto.email,
    );

    if (!response) {
      return BukkaResponse.customResponse(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response.emailConfirmed) {
      return BukkaResponse.customResponse(
        'Email verification successfull. Please login.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Date.now() > Number(response.confirmationCodeExpires)) {
      return BukkaResponse.customResponse(
        'This token has expired. Please request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (confirmationDto.token !== response.confirmationCode) {
      return BukkaResponse.customResponse(
        'Inavalid confirmation code',
        HttpStatus.BAD_REQUEST,
      );
    }

    response.userStatus = UserStatusEnum.ACTIVE;
    response.emailConfirmed = true;
    response.confirmationCode = null;
    response.confirmationCodeExpires = null;

    await this._userRepository.updateOtherUserAsync(response.id as number, {
      userStatus: response.userStatus,
      emailConfirmed: response.emailConfirmed,
      confirmationCode: response.confirmationCode,
      confirmationCodeExpires: response.confirmationCodeExpires,
    });

    return BukkaResponse.customResponse(
      'Email verification successful! Please login.',
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

    return BukkaResponse.customResponse(
      'Password reset successful. You can now login with your new password!',
      HttpStatus.OK,
      true,
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
