"use client";

import OnboardingWizard from "@/components/onboarding/onboarding-wizard";
import { useAuth } from "@/providers/auth-provider";
import { useParams } from "next/navigation";
import { UserRoleEnum } from "@/server/enums/UserRoleEnum";
import { UserRole } from "@/server/interfaces/Auth";

export default function OnboardingPage() {
  const { userDetails } = useAuth();
  const params = useParams();
  const roleParam = (
    params?.role as UserRole
  )?.toUpperCase() as keyof typeof UserRoleEnum;
  const effectiveRole = (roleParam || userDetails?.role) as UserRole;
  return <OnboardingWizard role={effectiveRole} />;
}
