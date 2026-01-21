import type { Request, Response } from 'express';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { AuthRepository } from 'src/BussinessLayer/AuthRepository';
import { RequestInfoHelper } from 'src/InfrastructureLayer/Helpers/RequestInfoHelper';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { GoogleAuthGuard } from 'src/MiddlewareLayer/Guards/GoogleAuthGuard';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/auth`)
export class OAuthController {
  private readonly isProd: boolean;
  private readonly cookieOptions: any;
  private readonly ACCESS_TOKEN_MAX_AGE: number;
  private readonly REFRESH_TOKEN_MAX_AGE: number;

  constructor(
    private readonly _authRepo: AuthRepository,
    private readonly _config: AppConfigurationService,
  ) {
    this.isProd = this._config.nodeEnv === EnvironmentTypeEnum.PROD;
    this.cookieOptions = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd ? 'none' : 'lax',
      path: '/',
    };
    this.ACCESS_TOKEN_MAX_AGE = this._config.accessTokenMaxAge;
    this.REFRESH_TOKEN_MAX_AGE = this._config.refreshTokenMaxAge;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // redirect handled by passport
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as any;

    const metaData = {
      ip: RequestInfoHelper.getClientIp(req),
      userAgent: RequestInfoHelper.getUserAgent(req),
    };
    const response = await this._authRepo.signInWithSocial(profile, metaData);

    res.cookie(TokenTypeEnum.ACCESS_TOKEN, response.responseData?.accessToken, {
      ...this.cookieOptions,
      maxAge: this.ACCESS_TOKEN_MAX_AGE,
      expires: new Date(Date.now() + this.ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie(
      TokenTypeEnum.REFRESH_TOKEN,
      response.responseData?.refreshToken,
      {
        ...this.cookieOptions,
        maxAge: this.REFRESH_TOKEN_MAX_AGE,
        expires: new Date(Date.now() + this.REFRESH_TOKEN_MAX_AGE),
      },
    );

    const state = req.query.state;

    console.log('CURRENT STATE IN QUERY: ', state);

    // redirect to client - you can attach state to redirect if needed
    return res.redirect(
      `${this._config.clientBaseUrl}${state ?? '/Oauth/bootstrap'}`,
    );
  }
}
