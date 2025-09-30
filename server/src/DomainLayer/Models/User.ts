export class User {
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
  confirmationCode?: string | null;
  confirmationCodeExpires?: Date | null;
  refreshToken?: string;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  isUpdated?: boolean;
  userNotifications?: any;
  favorites: any;
  createdAt?: Date;
  updatedAt?: Date;
}
