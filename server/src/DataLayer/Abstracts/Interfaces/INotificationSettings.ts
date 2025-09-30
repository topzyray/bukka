import { Prisma } from '@prisma/client';

export interface INotificationSettings {
  id: number;
  userId: number;
  userStatus?: string;
  settings?: Prisma.JsonValue;
}

export interface INotificationChannel {
  send(notification: any, channelRecordId: number): Promise<void>;
}
