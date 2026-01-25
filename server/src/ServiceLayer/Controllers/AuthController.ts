import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from 'src/DomainLayer/Decorators/PublicDecorator';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  SigninDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
  SigninMetaDataDto,
} from 'src/DomainLayer/Dtos/AuthDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { CreateUserDto } from 'src/DomainLayer/Dtos/UserDto';
import { AuthRepository } from 'src/BusinessLayer/AuthRepository';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { Throttle } from '@nestjs/throttler';
import { RequestInfoHelper } from 'src/InfrastructureLayer/Helpers/RequestInfoHelper';
import { ClientTypeHelper } from 'src/InfrastructureLayer/Helpers/ClientTypeHelper';
import { ClientTypeEnum } from 'src/DomainLayer/Enums/ClientTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/auth`)
@ApiTags('Auth')
export class AuthController {
  private readonly isProd: boolean;
  private readonly cookieOptions: any;
  private readonly clearCookieOptions: any;
  private readonly ACCESS_TOKEN_MAX_AGE: number;
  private readonly REFRESH_TOKEN_MAX_AGE: number;

  constructor(
    private readonly _authRepository: AuthRepository,
    private readonly _configService: AppConfigurationService,
  ) {
    this.ACCESS_TOKEN_MAX_AGE = this._configService.accessTokenMaxAge;
    this.REFRESH_TOKEN_MAX_AGE = this._configService.refreshTokenMaxAge;
    this.isProd = this._configService.nodeEnv === EnvironmentTypeEnum.PROD;
    this.cookieOptions = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd ? 'none' : 'lax',
      path: '/',
      // domain: this.isProd ? '.yourdomain.com' : undefined, // Add this later if the domain of both client and server are the same
    };
    this.clearCookieOptions = {
      ...this.cookieOptions,
    };
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
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Sign to account' })
  @ApiBody({ type: SigninDto })
  async signIn(
    @Body() request: SigninDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const metaData: SigninMetaDataDto = {
      ip: RequestInfoHelper.getClientIp(req),
      userAgent: RequestInfoHelper.getUserAgent(req),
    };
    const response = await this._authRepository.signIn(request, metaData);

    // If signIn failed return early
    if (!response?.status) {
      return BukkaResponse.GetStatusResponse(response, res);
    }

    const clientType = ClientTypeHelper.getClientType(req);
    const tokens = {
      accessToken: response.responseData?.accessToken,
      refreshToken: response.responseData?.refreshToken,
    };

    if (clientType === ClientTypeEnum.WEB) {
      // WEB: set cookies
      res.cookie(TokenTypeEnum.ACCESS_TOKEN, tokens.accessToken, {
        ...this.cookieOptions,
        maxAge: this.ACCESS_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + this.ACCESS_TOKEN_MAX_AGE),
      });
      res.cookie(TokenTypeEnum.REFRESH_TOKEN, tokens.refreshToken, {
        ...this.cookieOptions,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + this.REFRESH_TOKEN_MAX_AGE),
      });

      response.responseData = {
        user: response.responseData?.user,
        deviceId: response.responseData?.deviceId,
      };

      return BukkaResponse.GetStatusResponse(response, res);
    }

    // MOBILE: do NOT set cookies. Return tokens in response body
    response.responseData = {
      user: response.responseData?.user,
      deviceId: response.responseData?.deviceId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refreshes user token' })
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    // Accept cookie (web), body.refreshToken (mobile), or Authorization: Bearer <refreshToken>
    const refreshToken = ClientTypeHelper.getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found.');
    }

    const response = await this._authRepository.refreshToken(refreshToken);

    if (!response?.status) {
      return BukkaResponse.GetStatusResponse(response, res);
    }

    const clientType = ClientTypeHelper.getClientType(req);
    const tokens = {
      accessToken: response?.responseData?.accessToken,
      refreshToken: response?.responseData?.refreshToken,
    };
    const deviceId = response?.responseData?.deviceId;

    if (clientType === ClientTypeEnum.WEB) {
      res.cookie(TokenTypeEnum.ACCESS_TOKEN, tokens.accessToken, {
        ...this.cookieOptions,
        maxAge: this.ACCESS_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + this.ACCESS_TOKEN_MAX_AGE),
      });
      res.cookie(TokenTypeEnum.REFRESH_TOKEN, tokens.refreshToken, {
        ...this.cookieOptions,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + this.REFRESH_TOKEN_MAX_AGE),
      });
      response.responseData = {
        deviceId,
      };
      return BukkaResponse.GetStatusResponse(response, res);
    }

    // mobile: return new tokens in body (no cookies)
    response.responseData = {
      deviceId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('signout')
  @ApiOperation({ summary: 'Sign out logged in user' })
  async signOut(@Req() req: Request, @Res() res: Response) {
    // Accept cookie (web), body.refreshToken (mobile), or Authorization: Bearer <refreshToken>
    const refreshToken = ClientTypeHelper.getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      return BukkaResponse.GetStatusResponse(
        {
          status: true,
          responseCode: HttpStatus.OK,
          responseMessage: 'User already signed out',
          responseData: null,
        },
        res,
      );
    }

    const response = await this._authRepository.signOut(refreshToken);

    const clientType = ClientTypeHelper.getClientType(req);
    if (clientType === ClientTypeEnum.WEB) {
      res.clearCookie(TokenTypeEnum.ACCESS_TOKEN, this.clearCookieOptions);
      res.clearCookie(TokenTypeEnum.REFRESH_TOKEN, this.clearCookieOptions);
    }

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
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Body() dto: ChangePasswordDto, @Res() res: Response) {
    const response = await this._authRepository.changePassword(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
