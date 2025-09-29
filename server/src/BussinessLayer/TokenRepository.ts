import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { Generator } from 'src/InfrastructureLayer/Services/Generator';

@Injectable()
export class TokenRepository {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessTokenAsync(claims: TokenClaims): Promise<string> {
    const options = {
      expiresIn: Number.parseInt(process.env.TOKEN_EXPIRY_IN_SECONDS, 10),
      secret: process.env.TOKEN_SECRET,
    };
    return this.jwtService.signAsync({ claims }, options);
  }

  verifyAccessTokenAsync(token: string): Promise<TokenClaims> {
    const options = {
      secret: process.env.TOKEN_SECRET,
    };
    return this.jwtService.verifyAsync<TokenClaims>(token, options);
  }

  async generateRefreshTokenAsync(): Promise<string> {
    const refreshToken = Generator.generateRandomString();
    return refreshToken;
  }

  async generatePasswordResetTokenAsync(): Promise<string> {
    return await Generator.GenerateDigits(6).toString();
  }

  async generateEmailConfirmationTokenAsync(email: string): Promise<string> {
    const payload = { email, type: 'emailConfirmation' };
    const options = { expiresIn: '24h', secret: process.env.TOKEN_SECRET }; // Token will expire in 24 hours
    return await this.jwtService.signAsync(payload, options);
  }

  async verifyEmailConfirmationTokenAsync(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.TOKEN_SECRET,
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
