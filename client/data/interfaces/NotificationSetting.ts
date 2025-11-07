export type TNotification =
  | "isEmailTurnedOn"
  | "isInAppTurnedOn"
  | "isPushTurnedOn";

export interface NotificationSettings {
  id: number;
  userId: number;
  settings: Record<TNotification, boolean>;
  createdAt: Date;
  updatedAt: Date;
}
