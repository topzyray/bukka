import { User } from '@prisma/client';

export interface IUser extends User {
  isFollower: boolean;
  isFollowing: boolean;
}
