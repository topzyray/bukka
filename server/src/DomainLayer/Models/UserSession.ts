export class UserSession {
  id: number;
  userId: number;
  deviceId: string;
  refreshToken: String;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
