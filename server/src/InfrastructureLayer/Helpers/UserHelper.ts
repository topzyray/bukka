import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { InMemoryCacheService } from '../Services/InMemoryCacheService';
import { ForbiddenException, HttpStatus } from '@nestjs/common';

export class UserHelper {
  static async getLoggedInUser() {
    const authUser = InMemoryCacheService.getFromInMemory('authUser');
    return authUser;
  }

  static async hasAccess(userId: number) {
    const loggedInUser = await this.getLoggedInUser();
    if (loggedInUser?.userId !== userId) {
      // return BukkaResponse.errorResponse(
      //   'You do not have access to this resource!',
      //   HttpStatus.FORBIDDEN,
      // );
      throw new ForbiddenException('You do not have access to this resource!');
    }
  }
}
