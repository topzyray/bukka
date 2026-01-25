import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { SocialAccountProviderEnum } from 'src/DomainLayer/Enums/SocialAccountProviderEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  SocialAccountProviderEnum.GOOGLE,
) {
  constructor(config: AppConfigurationService) {
    super({
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.appUrl + '/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    _done: Function,
  ) {
    const user = {
      provider: SocialAccountProviderEnum.GOOGLE,
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      photo: profile.photos?.[0]?.value,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profile,
    };
    return user;
  }
}
