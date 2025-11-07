type TNotification = 'isEmailTurnedOn' | 'isInAppTurnedOn' | 'isPushTurnedOn';

export class NotificationSettings {
  id: number;
  userId: number;
  settings: Record<TNotification, boolean>;
  createdAt: Date;
  updatedAt: Date;
}
