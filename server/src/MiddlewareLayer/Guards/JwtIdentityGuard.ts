import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenRepository } from 'src/BusinessLayer/TokenRepository';
import { InMemoryCacheService } from 'src/InfrastructureLayer/Services/InMemoryCacheService';

@Injectable()
export class JwtIdentityGuard implements CanActivate {
  constructor(protected readonly _tokenRepository: TokenRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractAccessToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to make this request. Are you signed in?',
      );
    }

    try {
      const decodedToken =
        await this._tokenRepository.verifyAccessTokenAsync(token);

      if (!decodedToken || typeof decodedToken !== 'object') {
        throw new UnauthorizedException('Invalid access token.');
      }

      const claims = decodedToken.claims;
      if (!claims || !claims.id) {
        throw new UnauthorizedException(
          'You are not authorized to make this request. Invalid credentials.',
        );
      }

      // cache identity-level auth only
      InMemoryCacheService.saveToInMemory('authUser', claims);
      InMemoryCacheService.saveToInMemory('authToken', token);

      // also attach to request for downstream usage
      request.user = claims;
      request.accessToken = token;

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(
        'You are not authorized to make this request. Invalid credentials.',
      );
    }
  }

  protected extractAccessToken(request: any): string | undefined {
    let token: string | undefined;
    if (request.cookies?.accessToken) {
      token = request.cookies.accessToken;
    } else if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }
    return token;
  }
}
