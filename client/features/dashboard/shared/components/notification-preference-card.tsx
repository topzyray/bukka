"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Label,
  Switch,
} from "@/components/ui";
import { useEffect, useState, useTransition } from "react";
import { useUpdateSettings } from "@/data/mutations/userSetting/use-update-settings";
import { Loader2 } from "lucide-react";
import { useNotificationSetting } from "@/data/queries";
import { useAuth } from "@/providers";
import { TNotification } from "@/data/interfaces/NotificationSetting";
import { extractErrorMessage } from "@/utils";

const defaultSettings: Record<TNotification, boolean> = {
  isEmailTurnedOn: false,
  isInAppTurnedOn: false,
  isPushTurnedOn: false,
};

function SettingToggle({
  label,
  name,
  value,
  disabled,
  handler,
}: {
  label: string;
  name: string;
  value: boolean;
  disabled: boolean;
  handler: (name: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Switch
        id={name}
        checked={value}
        onCheckedChange={() => handler(name)}
        disabled={disabled}
        className="cursor-pointer"
      />
    </div>
  );
}

export function NotificationPreferencesCard() {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] =
    useState<Record<TNotification, boolean>>(defaultSettings);
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useNotificationSetting({
    userId: user?.id as number,
  });

  useEffect(() => {
    if (!isLoading && !isError && data?.responseData?.settings) {
      setSettings(data.responseData.settings);
    }
  }, [data, isError, isLoading]);

  const updateSettingMutation = useUpdateSettings();

  const toggleSetting = (key: TNotification) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: !prev[key] };
    });

    startTransition(() => {
      if (!settings) return;
      const updated = { ...settings, [key]: !settings[key] };
      updateSettingMutation.mutate({
        id: data?.responseData?.id,
        settings: updated,
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Notification Preferences{" "}
          {updateSettingMutation.isPending && (
            <Loader2 className="animate-spin" />
          )}
        </CardTitle>
        <CardDescription>
          Control how you receive updates and alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="py-12">
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Loading User Preferences
            </span>
          </div>
        )}

        {isError && (
          <div className="py-12">
            <span>{extractErrorMessage(error)}</span>
          </div>
        )}

        {settings && (
          <div className="space-y-4">
            <SettingToggle
              label="Email Notificatons"
              name="isEmailTurnedOn"
              value={settings?.isEmailTurnedOn}
              handler={() => toggleSetting("isEmailTurnedOn")}
              disabled={isPending}
            />

            <SettingToggle
              label="In-App Notifications"
              name="isInAppTurnedOn"
              value={settings?.isInAppTurnedOn}
              handler={() => toggleSetting("isInAppTurnedOn")}
              disabled={isPending}
            />

            <SettingToggle
              label="Push Notifications"
              name="isPushTurnedOn"
              value={settings?.isPushTurnedOn}
              handler={() => toggleSetting("isPushTurnedOn")}
              disabled={isPending}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
