import { UserRepository } from './UserRepository';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';
import { InuResponse } from 'src/DomainLayer/Models/InuResponse';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
} from 'src/DomainLayer/Dtos/AuthDto';
import { CreateUserDto, UserDto } from 'src/DomainLayer/Dtos/UserDto';
import { User } from '@prisma/client';
import { ValidationHelper } from 'src/InfrastructureLayer/Helpers/ValidationHelper';
import { UserStatusEnum } from 'src/DomainLayer/Enums/UserStatusEnum';
import { TokenRepository } from './TokenRepository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { mapper } from 'src/InfrastructureLayer/Services/MapperService';
import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';
import { FollowerRepository } from './FollowRepository';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _tokenRepository: TokenRepository,
    private readonly _followerRepository: FollowerRepository,
  ) {}

  async registerUser(userDto: CreateUserDto): Promise<InuResponse> {
    const hashedPassword = await Generator.hash(userDto.password, 10);
    userDto.password = hashedPassword;

    return await this._userRepository.createUserAsync(userDto);
  }

  async login(loginDto: LoginDto): Promise<InuResponse> {
    const response = await this._userRepository.findUserByEmail(loginDto.email);
    if (!response) {
      return InuResponse.loginResponse(
        'user',
        response?.user,
        false,
        'User with the email does not exist',
      );
    }
    const validUser = await this.validateUserAsync(
      response.user,
      loginDto.password,
    );
    if (!validUser) {
      return InuResponse.loginResponse(
        'user',
        response.user,
        false,
        'Incorrect Login Details',
      );
    }
    if (!response?.user.emailConfirmed) {
      return InuResponse.loginResponse(
        'user',
        response.user,
        false,
        'Please confirm your email address to be verified',
      );
    }
    if (response?.user.userStatus === UserStatusEnum.LOCKED) {
      return InuResponse.loginResponse(
        'user',
        response.user,
        false,
        'Your account has been locked. Please contact support.',
      );
    }

    const claims = mapper.map(response.user, UserDto, TokenClaims);

    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);
    const refreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();
    response.user.refreshToken = refreshToken;
    response.user.lastLoginAt = new Date();

    const loginResponse = new LoginResponseDto();

    await this._userRepository.updateOtherUserAsync(response.user.id, {
      id: response.user.id,
      refreshToken: response.user.refreshToken,
      lastLoginAt: response.user.lastLoginAt,
    });

    loginResponse.user = mapper.map(response.user, UserDto, UserResponse);

    loginResponse.accessToken = accessToken;
    loginResponse.refreshToken = response.user.refreshToken;
    loginResponse.counts = response.counts;

    return InuResponse.loginResponse('user', loginResponse, true);
  }

  async refreshToken(refreshToken: RefreshTokenDto): Promise<InuResponse> {
    const response = await this._userRepository.findUserById(
      refreshToken.userId,
    );

    if (!response) {
      return InuResponse.GetSingleDataResponse('User', response);
    }

    if (response.user.refreshToken !== refreshToken.oldRefreshToken) {
      return InuResponse.customResponse(
        'Invalid Refresh Token, Please Re-Login',
        HttpStatus.FORBIDDEN,
        false,
        null,
      );
    }

    const claims = {
      userId: response.user.id,
      email: response.user.email,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      role: response.user.role,
    };

    const accessToken =
      await this._tokenRepository.generateAccessTokenAsync(claims);

    response.user.refreshToken =
      await this._tokenRepository.generateRefreshTokenAsync();

    await this._userRepository.updateOtherUserAsync(response.user.id, {
      refreshToken: response.user.refreshToken,
    });

    return InuResponse.GetSingleDataResponse('token', {
      token: accessToken,
      refreshToken: response.user.refreshToken,
    });
  }

  async forgotPassword(
    forgotPassword: ForgotPasswordDto,
  ): Promise<InuResponse> {
    const response = await this._userRepository.findUserByEmail(
      forgotPassword.email,
    );

    if (!response) {
      return InuResponse.GetSingleDataResponse('User', response);
    }

    response.user.passwordResetToken =
      await this._tokenRepository.generatePasswordResetTokenAsync();

    const result = await this._userRepository.updateOtherUserAsync(
      response.user.id,
      {
        passwordResetToken: response.user.passwordResetToken,
      },
    );

    if (!result) {
      return InuResponse.customResponse(
        'Unable to request a new password reset code',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return InuResponse.customResponse(
      `We've sent a password reset link to ${result.responseData.email}. Please check your inbox and follow the instructions.`,
      HttpStatus.OK,
      true,
      response.user,
    );
  }

  async resetPassword(data: ResetPasswordDto): Promise<InuResponse> {
    const response = await this._userRepository.findUserByEmail(data.email);

    if (!response) {
      return InuResponse.GetSingleDataResponse('user', response);
    }

    if (response.user.passwordResetToken !== data.token) {
      return InuResponse.GetSingleDataResponse(
        'User',
        response.user,
        'Invalid password reset code',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.updatePassword(response.user, data.newPassword);
  }

  async changePassword(
    changePassword: ChangePasswordDto,
  ): Promise<InuResponse> {
    const response = await this._userRepository.findUserById(
      changePassword.userId,
    );

    if (!response) {
      return InuResponse.loginResponse(
        'User',
        response.user,
        false,
        'User does not exist',
      );
    }

    const validUser = await this.validateUserAsync(
      response.user,
      changePassword.currentPassword,
    );

    if (!validUser) {
      return InuResponse.loginResponse(
        'User',
        response.user,
        false,
        'Incorrect Current Password',
      );
    }

    return await this.updatePassword(response.user, changePassword.newPassword);
  }

  async resendConfirmationEmail(
    confirmEmailDto: ResendConfirmEmailDto,
  ): Promise<InuResponse> {
    const response = await this._userRepository.findUserByEmail(
      confirmEmailDto.email,
    );

    if (!response) {
      return InuResponse.customResponse(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response.user.emailConfirmed) {
      return InuResponse.customResponse(
        'Your email has already been verified. You can now log in.',
        HttpStatus.BAD_REQUEST,
      );
    }

    response.user.confirmationCode = Generator.GenerateDigits(6).toString();
    response.user.confirmationCodeExpires =
      Generator.calculateExpirationTime(30);

    await this._userRepository.updateOtherUserAsync(response.user.id, {
      confirmationCode: response.user.confirmationCode,
      confirmationCodeExpires: response.user.confirmationCodeExpires,
    });

    return InuResponse.customResponse(
      `Confirmation Email Resent Successfully to ${confirmEmailDto.email}`,
      HttpStatus.OK,
      true,
      response.user,
    );
  }

  async verifyEmail(confirmationDto: ConfirmEmailDto): Promise<InuResponse> {
    const response = await this._userRepository.findUserByEmail(
      confirmationDto.email,
    );

    if (!response) {
      return InuResponse.customResponse(
        'User does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (response.user.emailConfirmed) {
      return InuResponse.customResponse(
        'Your email has already been verified. You can now log in.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Date.now() > Number(response.user.confirmationCodeExpires)) {
      return InuResponse.customResponse(
        'This verification link has expired. Please request a new verification email if needed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (confirmationDto.token !== response.user.confirmationCode) {
      return InuResponse.customResponse(
        'Incorrect confirmation code',
        HttpStatus.BAD_REQUEST,
      );
    }

    response.user.userStatus = UserStatusEnum.ACTIVE;
    response.user.emailConfirmed = true;
    response.user.confirmationCode = null;
    response.user.confirmationCodeExpires = null;

    await this._userRepository.updateOtherUserAsync(response.user.id, {
      userStatus: response.user.userStatus,
      emailConfirmed: response.user.emailConfirmed,
      confirmationCode: response.user.confirmationCode,
      confirmationCodeExpires: response.user.confirmationCodeExpires,
    });
    await this._followerRepository.followAdmin(response.user.id);

    return InuResponse.customResponse(
      'Your email address has been successfully verified! You can now log in to your account.',
      HttpStatus.OK,
      true,
      null,
    );
  }

  private async updatePassword(
    user: User,
    newPassword: string,
  ): Promise<InuResponse> {
    const hashedPassword = await Generator.hash(newPassword, 10);
    user.password = hashedPassword;
    const result = await this._userRepository.updateOtherUserAsync(user.id, {
      password: user.password,
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    if (!result.status) {
      return InuResponse.customResponse(
        'Unable to change password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return InuResponse.customResponse(
      'Your password has been successfully reset. You can now use your new password to login',
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
