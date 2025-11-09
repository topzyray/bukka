"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserNotification } from "@/data/interfaces/Notification";
import { Badge, Card, CardContent, Skeleton } from "@/components/ui";
import { useNotificationById } from "@/data/queries";

export function NotificationDetails() {
  const { id } = useParams() as { id: string };
  const { data, isLoading, isError, error } = useNotificationById({
    notificationId: Number.parseInt(id, 10),
  });

  const notification = data?.responseData;

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (!notification) return <p className="text-muted-foreground">Not found</p>;

  return (
    <div className="space-y-4">
      <Link
        href="/notifications"
        className="flex items-center text-sm hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Notifications
      </Link>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{notification?.title}</h2>
            <Badge>{notification?.notificationCategory}</Badge>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {notification?.message}
          </p>

          {notification?.link && (
            <Link
              href={notification?.link}
              className="text-primary hover:underline text-sm font-medium"
            >
              View Related Content →
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
