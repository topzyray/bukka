import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigurationService,
  ) {}

  async generateAccessTokenAsync(claims: TokenClaims): Promise<string> {
    const options = {
      expiresIn: Number.parseInt(this.configService.tokenExpiry as string, 10),
      secret: this.configService.tokenSecret,
    };
    return this.jwtService.signAsync({ claims }, options);
  }

  verifyAccessTokenAsync(token: string): Promise<TokenClaims> {
    const options = {
      secret: this.configService.tokenSecret,
    };
    return this.jwtService.verifyAsync<TokenClaims>(token, options);
  }

  async generateRefreshTokenAsync(): Promise<string> {
    const refreshToken = Generator.GenerateRandomString();
    return refreshToken;
  }

  async generatePasswordResetTokenAsync(): Promise<string> {
    return Generator.GenerateDigits(6).toString();
  }

  async generateEmailConfirmationTokenAsync(email: string): Promise<string> {
    const payload = { email, type: 'emailConfirmation' };
    const options: JwtSignOptions = {
      expiresIn: '24h',
      secret: this.configService.tokenSecret,
    }; // Token will expire in 24 hours
    return await this.jwtService.signAsync(payload, options);
  }

  async verifyEmailConfirmationTokenAsync(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.tokenSecret,
      });
      if (payload.type !== 'emailConfirmation') {
        throw new UnauthorizedException();
      }
      return payload.email;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired confirmation token.');
    }
  }
}
