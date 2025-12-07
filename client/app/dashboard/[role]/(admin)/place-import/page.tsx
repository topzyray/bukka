"use client";

import { useAuth } from "@/providers";
import { redirect } from "next/navigation";
import { UserRoleEnum } from "@/data/enums";
import { AdminPlaceImport } from "@/features/dashboard/admin/place-import";

export default function AdminPlaceImportPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <AdminPlaceImport />;
    default:
      redirect(`/dashboard/${user?.role?.toLowerCase()}/unauthorized`);
  }
}
