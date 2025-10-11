import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from 'src/DomainLayer/Decorators/PublicDecorator';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  SigninDto,
  RefreshTokenDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
} from 'src/DomainLayer/Dtos/AuthDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { CreateUserDto } from 'src/DomainLayer/Dtos/UserDto';
import { AuthRepository } from 'src/BussinessLayer/AuthRepository';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';

const ACCESS_TOKEN_MAX_AGE = 30 * 60 * 1000; // 30 minutes
const REFRESH_TOKEN_MAX_AGE = 14 * 24 * 60 * 60 * 1000; // 14 days

@Controller(`${BaseApiRoutesConstant.BASE_URL}/auth`)
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  private readonly isProd: boolean;

  constructor(
    private readonly _authRepository: AuthRepository,
    private readonly _configService: AppConfigurationService,
  ) {
    this.isProd = this._configService.nodeEnv === EnvironmentTypeEnum.PROD;
  }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create a new account.' })
  @ApiBody({ type: CreateUserDto })
  async signUp(@Body() request: CreateUserDto, @Res() res: Response) {
    const response = await this._authRepository.signUp(request);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Sign to account' })
  @ApiBody({ type: SigninDto })
  async signIn(@Body() request: SigninDto, @Res() res: Response) {
    const response = await this._authRepository.signIn(request);
    res.cookie(
      TokenTypeEnum.ACCESS_TOKEN,
      response?.responseData?.accessToken,
      {
        httpOnly: true,
        secure: this.isProd,
        sameSite: 'lax',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      },
    );
    res.cookie(
      TokenTypeEnum.REFRESH_TOKEN,
      response?.responseData?.refreshToken,
      {
        httpOnly: true,
        secure: this.isProd,
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      },
    );
    response.responseData = response?.responseData?.user;
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('signout')
  @ApiOperation({ summary: 'Sign out logged in user' })
  async signOut(@Res() res: Response) {
    res.clearCookie(TokenTypeEnum.ACCESS_TOKEN, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie(TokenTypeEnum.REFRESH_TOKEN, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'lax',
      path: '/',
    });

    const response = BukkaResponse.customResponse(
      'User signed out successfully',
      HttpStatus.NO_CONTENT,
      true,
      null,
    );

    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('confirm-email')
  @ApiOperation({ summary: 'Confirm users email' })
  @ApiBody({ type: ConfirmEmailDto })
  async verifyEmail(@Body() request: ConfirmEmailDto, @Res() res: Response) {
    const response = await this._authRepository.verifyEmail(request);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('resend-confirmation-email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: ResendConfirmEmailDto })
  async resendEmailVerification(
    @Body() req: ResendConfirmEmailDto,
    @Res() res: Response,
  ) {
    const response = await this._authRepository.resendConfirmationEmail(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refreshes user token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() req: RefreshTokenDto, @Res() res: Response) {
    const response = await this._authRepository.refreshToken(req);
    res.cookie(
      TokenTypeEnum.ACCESS_TOKEN,
      response?.responseData?.accessToken,
      {
        httpOnly: true,
        secure: this.isProd,
        sameSite: 'lax',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      },
    );
    res.cookie(
      TokenTypeEnum.REFRESH_TOKEN,
      response?.responseData?.refreshToken,
      {
        httpOnly: true,
        secure: this.isProd,
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      },
    );
    response.responseData = null;
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password api' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() req: ForgotPasswordDto, @Res() res: Response) {
    const response = await this._authRepository.forgotPassword(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset and update user password' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() req: ResetPasswordDto, @Res() res: Response) {
    const response = await this._authRepository.resetPassword(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Body() req: ChangePasswordDto, @Res() res: Response) {
    const response = await this._authRepository.changePassword(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
