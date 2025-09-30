import { InMemoryCacheService } from '../Services/InMemoryCacheService';

export class UserHelper {
  static async getLoggedInUser() {
    const authUser = InMemoryCacheService.getFromInMemory('authUser');
    return authUser;
  }
}
