export type NewUserNotificationDto = {
  userId: number;
  title?: string;
  message: string;
  link?: string;
  icon?: string;
  notificationCategory: string;
};
