import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { CacheService } from '../../InfrastructureLayer/Services/CacheService';
import { UserTypeEnum } from '../../DomainLayer/Enums/UserTypeEnum';
import { JwtAuthGuard } from './JwtAuthGuard';
import { Reflector } from '@nestjs/core';
import { TokenRepository } from '../../BusinessLayer/TokenRepository';

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    private readonly tokenRepository: TokenRepository,
  ) {
    super(tokenRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const authUser = await CacheService.getFromInMemory('authUser');

    if (authUser && authUser.role === UserTypeEnum.ADMIN) {
      return true;
    } else {
      throw new UnauthorizedException(
        'You are not authorized to make this request. Requires an ADMIN user.',
      );
    }
  }
}
