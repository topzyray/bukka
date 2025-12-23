"use client";

import Link from "next/link";
import { Loader2, Trash2, View } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Badge,
  BukkaButton,
  Button,
  Card,
  CardContent,
  Separator,
} from "@/components/ui";
import { useAuth } from "@/providers";
import { useReadNotificaiton } from "@/data/mutations/userNotification/use-read-notification";
import { UserNotification } from "@/data/interfaces/Notification";
import { useDeleteNotification } from "@/data/mutations/userNotification/use-clear-notification";
import { useState } from "react";

export function NotificationCard({
  notification,
}: {
  notification: UserNotification;
}) {
  const [currentItemDeleting, setCurrentItemDeleting] = useState<null | number>(
    null
  );
  const { user } = useAuth();
  const readNotificationMutation = useReadNotificaiton({});
  const deleteNotificationMutation = useDeleteNotification({
    userId: user?.id,
    onSuccess: () => {
      setCurrentItemDeleting(null);
    },
  });

  const handleDelete = (id: number) => {
    setCurrentItemDeleting(id);
    deleteNotificationMutation.mutate(id);
  };

  return (
    // <Link href={`/notifications/${notification.id}`}>
    <Card
      className={`transition hover:bg-muted/50 ${
        !notification.isRead ? "border-primary" : ""
      }`}
    >
      <CardContent className="p-4 flex flex-wrap justify-between items-center gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{notification.title}</h3>
            {!notification.isRead && <Badge>New</Badge>}
          </div>
          <p className="text-sm text-muted-foreground text-wrap">
            {notification.message}
          </p>
          <Separator />
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {!notification.isRead && (
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={() => readNotificationMutation.mutate(notification.id)}
            >
              {readNotificationMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <View />
                  Mark as Read
                </>
              )}
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            className="dark:bg-red-800 dark:text-foreground h-7 text-xs"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(notification.id);
            }}
            disabled={
              deleteNotificationMutation.isPending &&
              currentItemDeleting === notification.id
            }
          >
            {deleteNotificationMutation.isPending &&
            currentItemDeleting === notification.id ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting
              </>
            ) : (
              <>
                <Trash2 className="h-8 w-8" /> Delete
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    // </Link>
  );
}
