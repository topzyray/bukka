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
  onboardingProgress?: number;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  userStatus?: string;
  emailConfirmed?: boolean;
  confirmationCode?: string | null;
  confirmationCodeExpires?: Date | null;
  refreshToken?: string;
  refreshTokenExpires?: Date | null;
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

  // preferences?: {
  //   cuisines: string[];
  //   priceRange: [number, number];
  //   radius: number;
  // };
}
