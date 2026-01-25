import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InMemoryCacheService } from '../../InfrastructureLayer/Services/InMemoryCacheService';
import { UserTypeEnum } from '../../DomainLayer/Enums/UserTypeEnum';
import { JwtAuthGuard } from './JwtAuthGuard';
import { Reflector } from '@nestjs/core';
import { TokenRepository } from 'src/BusinessLayer/TokenRepository';
import { UserSessionRepository } from 'src/BusinessLayer/UserSessionRepository';

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    private readonly tokenRepository: TokenRepository,
    private readonly userSessionRepository: UserSessionRepository,
  ) {
    super(tokenRepository, userSessionRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const authUser = await InMemoryCacheService.getFromInMemory('authUser');

    if (authUser && authUser.role === UserTypeEnum.ADMIN) {
      return true;
    } else {
      throw new ForbiddenException(
        'You are forbidden to make this request. Requires an ADMIN user.',
      );
    }
  }
}
