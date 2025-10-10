import { TokenClaims } from 'src/DomainLayer/Models/TokenClaims';
import { InMemoryCacheService } from '../Services/InMemoryCacheService';
import { ForbiddenException } from '@nestjs/common';

export class UserHelper {
  static async getLoggedInUser(): Promise<TokenClaims> {
    const authUser = InMemoryCacheService.getFromInMemory('authUser');
    return authUser;
  }

  static async hasAccess(userId: number) {
    const loggedInUser = await this.getLoggedInUser();
    if (loggedInUser?.id !== userId) {
      throw new ForbiddenException('You do not have access to this resource!');
    }
  }
}
