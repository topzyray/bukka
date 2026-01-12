"use client";

import { useAuth } from "@/providers";
import { UserRoleEnum } from "@/data/enums";
import { BusinessList } from "@/features/dashboard/admin/business-list";
import { MyBusinessList } from "@/features/dashboard/vendor/my-business-list";
import { redirect } from "next/navigation";

export default function Businesses() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <BusinessList />;
    case UserRoleEnum.VENDOR:
      return <MyBusinessList />;
    default:
      redirect(`/dashboard/${user?.role?.toLowerCase()}/not-found`);
  }
}
