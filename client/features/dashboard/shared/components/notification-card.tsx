"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { useAuth } from "@/providers";
import { useReadNotificaiton } from "@/data/mutations/userNotification/use-read-notification";
import { UserNotification } from "@/data/interfaces/Notification";

export function NotificationCard({
  notification,
  onUpdate,
}: {
  notification: UserNotification;
  onUpdate?: () => void;
}) {
  const { user } = useAuth();
  const readNotificationMutation = useReadNotificaiton({ userId: user?.id });

  return (
    <Link
      href={`/notifications/${notification.id}`}
      onClick={() => readNotificationMutation.mutate(notification.id)}
    >
      <Card
        className={`transition hover:bg-muted/50 ${
          !notification.isRead ? "border-primary" : ""
        }`}
      >
        <CardContent className="p-4 flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{notification.title}</h3>
              {!notification.isRead && <Badge>New</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              //   handleDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
