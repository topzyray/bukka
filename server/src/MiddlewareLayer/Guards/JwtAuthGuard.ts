import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtIdentityGuard } from './JwtIdentityGuard';
import { UserSessionRepository } from 'src/BusinessLayer/UserSessionRepository';
import { InMemoryCacheService } from 'src/InfrastructureLayer/Services/InMemoryCacheService';
import { TokenRepository } from 'src/BusinessLayer/TokenRepository';

@Injectable()
export class JwtAuthGuard extends JwtIdentityGuard {
  constructor(
    tokenRepository: TokenRepository,
    private readonly _userSessionRepository: UserSessionRepository,
  ) {
    super(tokenRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1️⃣ identity verification (token + claims)
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest();
    const deviceId = request.headers['x-device-id'] as string | undefined;
    const claims = request.user;

    if (!deviceId) {
      throw new UnauthorizedException(
        'Missing device identifier. Please sign in again.',
      );
    }

    // 2️⃣ session verification
    const session = await this._userSessionRepository.findActiveSession(
      claims.id,
      deviceId,
    );

    if (!session?.status) {
      throw new UnauthorizedException(
        'Your session for this device has expired or been revoked. Please sign in again.',
      );
    }

    // cache full auth context
    InMemoryCacheService.saveToInMemory('deviceId', deviceId);

    return true;
  }
}
