import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InMemoryCacheService } from 'src/InfrastructureLayer/Services/InMemoryCacheService';
import { JwtAuthGuard } from './JwtAuthGuard';
import { TokenRepository } from 'src/BussinessLayer/TokenRepository';
import { UserSessionRepository } from 'src/BussinessLayer/UserSessionRepository';
import { DecoratorKeyEnum } from 'src/DomainLayer/Enums/DecoratorKeyEnum';

@Injectable()
export class AuthorizationGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    private relector: Reflector,
    private readonly tokenRepository: TokenRepository,
    private readonly userSessionRepository: UserSessionRepository,
  ) {
    super(tokenRepository, userSessionRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authUser = await InMemoryCacheService.getFromInMemory('authUser');

    if (!authUser) {
      throw new UnauthorizedException(
        'You are not authorized to make this request. Are you signed in?',
      );
    }

    const requiredRoutePermissions = this.relector.getAllAndOverride(
      DecoratorKeyEnum.PERMISSION,
      [context.getHandler(), context.getClass()],
    );

    return true;
  }
}
