import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TokenRepository } from 'src/BusinessLayer/TokenRepository';
import { CacheService } from 'src/InfrastructureLayer/Services/CacheService';
import { RoutePermissions } from 'src/InfrastructureLayer/Permissions/RoutePermissions';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private _tokenRepository: TokenRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException(
        'You are not authorized to make this request. Are you signed in?',
      );
    }

    try {
      const decodedToken =
        await this._tokenRepository.verifyAccessTokenAsync(token);

      if (!decodedToken || typeof decodedToken !== 'object') {
        throw new ForbiddenException('Invalid token.');
      }

      const claims = decodedToken.claims;

      if (!claims || !claims.role) {
        throw new ForbiddenException(
          'You are not authorized to make this request. Invalid credentials.',
        );
      }

      CacheService.saveToInMemory('authUser', claims);
      CacheService.saveToInMemory('authToken', token);
      return true;
    } catch (error: any) {
      console.log(error);

      throw new ForbiddenException(
        'You are not authorized to make this request. Invalid credentials.',
      );
    }
  }

  private canAccessRoute(routeType: string, routeUrl: string): boolean {
    switch (routeType) {
      default:
        return RoutePermissions.CanAccessBaseRoutes(routeUrl);
    }
  }
}
