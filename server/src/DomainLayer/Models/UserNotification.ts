export class UserNotification {
  id?: number;
  userId: number;
  title?: string | null;
  message: string | null;
  link?: string | null;
  icon?: string | null;
  notificationCategory: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
