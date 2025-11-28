"use client";

import { UserRoleEnum } from "@/data/enums";
import { RecommendationsList } from "@/features/dashboard/admin/recommendations-list";
import { MyRecommendationsList } from "@/features/dashboard/shared/my-recommendations-list";
import { useAuth } from "@/providers";
import { redirect } from "next/navigation";

export default function RecommendatonsPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <RecommendationsList />;
    case UserRoleEnum.VENDOR:
      return <MyRecommendationsList />;
    case UserRoleEnum.USER:
      return <MyRecommendationsList />;
    default:
      return redirect(`/dashboard/${user?.role.toLowerCase()}/overview`);
  }
}
