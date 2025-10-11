export interface UserNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  notificationCategory: string;
  isRead: boolean;
  icon?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}
