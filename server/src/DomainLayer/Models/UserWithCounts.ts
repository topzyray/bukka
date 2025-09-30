import { User } from './User';

export interface UserWithCounts {
  id?: number;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  username?: string;
  gender?: string;
  bio?: string;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  userStatus?: string;
  emailConfirmed?: boolean;
  confirmationCode?: string;
  confirmationCodeExpires?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  isUpdated?: boolean;
  userNotifications?: any;
  favorites: any;
  createdAt?: Date;
  updatedAt?: Date;
  counts: {
    favorites: number;
  };
}
