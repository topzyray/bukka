import { UserRoleEnum } from '../Enums/UserRoleEnum';
import { GenderEnum } from '../Enums/GenderEnum';
import { UserStatusEnum } from '../Enums/UserStatusEnum';
import { UserNotification } from './UserNotification';
import { Favorite } from '@prisma/client';
import { UserSession } from './UserSession';

export class UserResponse {
  id: number;
  email: string;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
  username: string;
  gender: GenderEnum;
  onboardingProgress: number;
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
  refreshTokenExpires: Date;
  lastLoginAt: Date;
  isDeleted: boolean;
  isOnboarded: boolean;
  deletedAt: Date;
  favorites: Favorite[];
  userNotifications: UserNotification[];
  authSessions: UserSession[];
  createdAt: Date;
  updatedAt: Date;
  counts: {
    favorites: number;
  };
}
