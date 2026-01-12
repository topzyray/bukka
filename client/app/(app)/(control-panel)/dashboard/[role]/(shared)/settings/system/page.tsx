"use client";

import { UserRoleEnum } from "@/data/enums";
import { SystemSettings } from "@/features/dashboard/admin/system-setting";
import { useAuth } from "@/providers";
import { redirect } from "next/navigation";

export default function SystemSettingsPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <SystemSettings />;
    default:
      redirect(`/dashboard/${user?.role?.toLowerCase()}/not-found`);
  }
}
