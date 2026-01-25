import type { Request, Response } from 'express';
import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { AuthRepository } from 'src/BusinessLayer/AuthRepository';
import { RequestInfoHelper } from 'src/InfrastructureLayer/Helpers/RequestInfoHelper';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { EnvironmentTypeEnum } from 'src/DomainLayer/Enums/EnvironmentTypeEnum';
import { GoogleAuthGuard } from 'src/MiddlewareLayer/Guards/GoogleAuthGuard';
import { ClientTypeEnum } from 'src/DomainLayer/Enums/ClientTypeEnum';
import { OAuthHelper } from 'src/InfrastructureLayer/Helpers/OAuthHelper';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/auth`)
export class OAuthController {
  private readonly isProd: boolean;
  private readonly cookieOptions: any;
  private readonly ACCESS_TOKEN_MAX_AGE: number;
  private readonly REFRESH_TOKEN_MAX_AGE: number;
  private readonly logger = new Logger(OAuthController.name);

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
    const rawState = req.query.state as string;

    const parsedState = OAuthHelper.decodeState(rawState);

    const clientType =
      parsedState?.client === ClientTypeEnum.MOBILE
        ? ClientTypeEnum.MOBILE
        : ClientTypeEnum.WEB;

    const webRedirectPath = parsedState?.redirectPath ?? '/Oauth/bootstrap';

    const response = await this._authRepo.signInWithSocial(profile, {
      ip: RequestInfoHelper.getClientIp(req),
      userAgent: RequestInfoHelper.getUserAgent(req),
    });

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
      this.logger.log(
        `Redirecting to: ${this._config.clientBaseUrl}${webRedirectPath}`,
      );
      return res.redirect(`${this._config.clientBaseUrl}${webRedirectPath}`);
    }

    // MOBILE: DON'T set cookies. Instead redirect to a mobile deep link with tokens.
    // WARNING: passing tokens in URL has risks (leak in referer). Prefer exchange-with-code+PKCE in production.

    const deepLink =
      OAuthHelper.extractDeepLinkFromState(rawState) ||
      'myapp://oauth-callback';
    const url = `${deepLink}?accessToken=${encodeURIComponent(tokens.accessToken)}&refreshToken=${encodeURIComponent(tokens.refreshToken)}&deviceId=${encodeURIComponent(deviceId)}`;
    return res.redirect(url);
  }
}
