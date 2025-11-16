import { UserRole } from "./Auth";

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  username: string;
  gender: string;
  bio: string;
  onboardingProgress: number;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  userStatus: string;
  emailConfirmed: boolean;
  confirmationCode: string | null;
  confirmationCodeExpires: string | null;
  refreshToken: string;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  passwordChangedAt: string;
  lastLoginAt: string;
  isDeleted: boolean;
  deletedAt: string;
  isOnboarded: boolean;
  userNotifications: any;
  favorites: any;
  createdAt: string;
  updatedAt: string;
  preferences: {
    cuisines: string[];
    priceRange: [number, number];
    radius: number;
  };
}
