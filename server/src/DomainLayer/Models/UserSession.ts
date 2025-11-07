import { User } from './User';

export class UserSession {
  id: number;
  userId: number;
  user: User;
  deviceId: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
