import { UserNotification } from "@/data/interfaces/Notification";
import { NotificationCard } from "./components/notification-card";

export function NotificationsList({
  notifications,
}: {
  notifications: UserNotification[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} />
      ))}
    </div>
  );
}
