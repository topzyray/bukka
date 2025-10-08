import { UserRoleEnum } from '../Enums/UserRoleEnum';
import { GenderEnum } from '../Enums/GenderEnum';
import { UserStatusEnum } from '../Enums/UserStatusEnum';
import { UserNotification } from './UserNotification';
import { Favorite } from '@prisma/client';

export class UserResponse {
  id: number;
  email: string;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
  username: string;
  gender: GenderEnum;
  confirmationCodeExpires: Date;
  phoneNumber: string;
  phoneCountryCode: string;
  phoneNumberConfirmed: boolean;
  bio?: string;
  locationId: number;
  location: Location;
  userStatus: UserStatusEnum;
  emailConfirmed: boolean;
  refreshToken: string;
  lastLoginAt: Date;
  isDeleted: boolean;
  isUpdated: boolean;
  deletedAt: Date;
  favorites: Favorite[];
  userNotifications: UserNotification[];
  createdAt: Date;
  updatedAt: Date;
  counts: {
    favorites: number;
  };
}
