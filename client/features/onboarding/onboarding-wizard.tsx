"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { OnboardingProvider } from "@/providers/onboarding-provider";
import { ImageUploadStep } from "./steps/image-upload-step";
import { PersonalDetailsStep } from "./steps/personal-details-step";
import { useAuth } from "@/providers/auth-provider";
import { useOnboardingProgress } from "@/data/queries/use-onboarding-progress-query";
import { useSaveOnboardingProgress } from "@/data/mutations/user/use-onboarding-progress-mutation";
import { UserRole } from "@/data/interfaces/Auth";
import { User } from "@/data/interfaces/User";
import { CircularLoader } from "@/components/loaders/circular-loader";
import { UserPersonalizedDetailsStep } from "./steps/steps-role/user-personalized-details-step";
import { Stepper } from "./ui/stepper";
import { OnboardingCompleteScreen } from "./steps/onboarding-completion";

const RiderVehicleStep = dynamic(
  () => import("./steps/steps-role/rider-vehicle-step").then((m) => m.default),
  { ssr: false }
);
const BusinessDetailsStep = dynamic(
  () =>
    import("./steps/steps-role/business-details-step").then((m) => m.default),
  { ssr: false }
);
const InvestorDetailsStep = dynamic(
  () =>
    import("./steps/steps-role/investor-details-step").then((m) => m.default),
  { ssr: false }
);

/** Step descriptor */
type TStepDescriptor = {
  id: string;
  title: string;
  Component: React.ComponentType<any>;
};

/** Map roles -> step descriptors */
const roleStepMap: Record<UserRole, TStepDescriptor[]> = {
  ADMIN: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Bio-Data",
      Component: PersonalDetailsStep,
    },
    {
      id: "completion",
      title: "Final Step",
      Component: OnboardingCompleteScreen,
    },
  ],
  USER: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Bio-Data",
      Component: PersonalDetailsStep,
    },
    {
      id: "other",
      title: "Other Info",
      Component: UserPersonalizedDetailsStep,
    },
    {
      id: "completion",
      title: "Final Step",
      Component: OnboardingCompleteScreen,
    },
  ],
  RIDER: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Bio-Data",
      Component: PersonalDetailsStep,
    },
    { id: "vehicle", title: "Vehicle Details", Component: RiderVehicleStep },
    {
      id: "completion",
      title: "Final Step",
      Component: OnboardingCompleteScreen,
    },
  ],
  VENDOR: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Bio-Data",
      Component: PersonalDetailsStep,
    },
    {
      id: "business",
      title: "Business Details",
      Component: BusinessDetailsStep,
    },
    {
      id: "completion",
      title: "Final Step",
      Component: OnboardingCompleteScreen,
    },
  ],
  INVESTOR: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Bio-Data",
      Component: PersonalDetailsStep,
    },
    {
      id: "investor",
      title: "Investment Details",
      Component: InvestorDetailsStep,
    },
    {
      id: "completion",
      title: "Final Step",
      Component: OnboardingCompleteScreen,
    },
  ],
};

export function OnboardingWizard({ role }: { role: UserRole }) {
  return (
    <OnboardingProvider initialRole={role}>
      <OnboardingFlow role={role} />
    </OnboardingProvider>
  );
}

function OnboardingFlow({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const userId = user?.id as number;
  const steps = useMemo(() => roleStepMap[role], [role]);

  const { data: savedProgress, isLoading } = useOnboardingProgress(userId);

  const saveProgressMutation = useSaveOnboardingProgress({
    user: user as User,
    toastStatusMessage: false,
  });

  const [currentStep, setCurrentStep] = useState<number>(savedProgress);

  // Sync local state with backend progress
  useEffect(() => {
    if (!isLoading && typeof savedProgress === "number") {
      setCurrentStep(savedProgress);
    }
  }, [isLoading, savedProgress]);

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  /** Move to next step and persist progress */
  const goNext = () => {
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStep);

    if (userId) {
      saveProgressMutation.mutate({ onboardingProgress: nextStep });
    }
  };

  /** Go back or jump to a specific step */
  const goBack = (to?: number) => {
    const newStep =
      typeof to === "number"
        ? Math.max(0, Math.min(to, steps.length - 1))
        : Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);
  };

  const StepComponent = current?.Component;

  return (
    <div className="max-w-3xl mx-auto sm:py-4">
      <Stepper
        steps={steps.map((s) => s.title)}
        currentStep={currentStep}
        clickable={false}
        animatedBar={true}
        onStepClick={(i) => {
          setCurrentStep(i);
          if (userId) {
            saveProgressMutation.mutate({ onboardingProgress: i });
          }
        }}
      />

      <div className="mt-6 bg-card p-2 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">{current?.title}</h3>

        {isLoading && <CircularLoader text="Loading Onboarding Screen" />}

        {StepComponent && (
          <StepComponent onNext={goNext} onBack={goBack} isLast={isLast} />
        )}
      </div>
    </div>
  );
}
