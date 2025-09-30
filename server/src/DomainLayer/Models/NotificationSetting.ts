export class NotificationSettings {
  id?: number;
  userId: string;
  userStatus?: string | null;
  description?: string | null;
  settings?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
