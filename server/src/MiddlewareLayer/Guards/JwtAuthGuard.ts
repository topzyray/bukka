import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenRepository } from 'src/BussinessLayer/TokenRepository';

import { RoutePermissions } from 'src/InfrastructureLayer/Permissions/RoutePermissions';
import { InMemoryCacheService } from 'src/InfrastructureLayer/Services/InMemoryCacheService';
import { UserSessionRepository } from 'src/BussinessLayer/UserSessionRepository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly _tokenRepository: TokenRepository,
    private readonly _userSessionRepository: UserSessionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token: string | undefined = this.extractAccessToken(request);
    const deviceId = request.headers['x-device-id'] as string | undefined;

    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to make this request. Are you signed in?',
      );
    }

    if (!deviceId) {
      throw new UnauthorizedException(
        'Missing device identifier. Please sign in again.',
      );
    }

    try {
      const decodedToken =
        await this._tokenRepository.verifyAccessTokenAsync(token);

      if (!decodedToken || typeof decodedToken !== 'object') {
        throw new UnauthorizedException('Invalid access token.');
      }

      const claims = decodedToken.claims;
      if (!claims || !claims.role || !claims.id) {
        throw new UnauthorizedException(
          'You are not authorized to make this request. Invalid credentials.',
        );
      }

      const session = await this._userSessionRepository.findActiveSession(
        claims.id,
        deviceId,
      );

      if (!session?.status) {
        throw new UnauthorizedException(
          'Your session for this device has expired or been revoked. Please sign in again.',
        );
      }

      InMemoryCacheService.saveToInMemory('authUser', claims);
      InMemoryCacheService.saveToInMemory('authToken', token);
      InMemoryCacheService.saveToInMemory('deviceId', deviceId);

      return true;
    } catch (error: any) {
      console.log(error);

      throw new UnauthorizedException(
        'You are not authorized to make this request. Invalid credentials.',
      );
    }
  }

  private extractAccessToken(request: any): string | undefined {
    let token: string | undefined;
    if (request.cookies?.accessToken) {
      token = request.cookies.accessToken;
    } else if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization?.split(' ')[1];
    }
    return token;
  }

  private canAccessRoute(routeType: string, routeUrl: string): boolean {
    switch (routeType) {
      default:
        return RoutePermissions.CanAccessBaseRoutes(routeUrl);
    }
  }
}
