export interface IUserNotification {
  userId: number;
  title: string;
  message: string;
  notificationType: string;
  references: any;
  isRead: boolean;
  icon: string;
}
