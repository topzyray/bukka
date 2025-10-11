"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { OnboardingProvider } from "@/providers/onboarding-provider";
import ImageUploadStep from "./steps/image-upload-step";
import PersonalDetailsStep from "./steps/personal-details-step";
import Stepper from "./ui/stepper";
import { useAuth } from "@/providers/auth-provider";
import { useOnboardingProgress } from "@/server/queries/use-onboarding-progress-query";
import { useSaveOnboardingProgress } from "@/server/mutations/user/use-onboarding-progress-mutation";
import { UserRole } from "@/server/interfaces/Auth";
import { User } from "@/server/interfaces/User";
import { CircularLoader } from "../loaders/circular-loader";
import UserPersonalizedDetailsStep from "./steps/steps-role/user-personalized-details-step";

/* ────────────────────────────────────────────────
   Dynamically import role-specific steps
────────────────────────────────────────────────── */
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
type StepDescriptor = {
  id: string;
  title: string;
  Component: React.ComponentType<any>;
};

/** Map roles -> step descriptors */
const roleStepMap: Record<UserRole, StepDescriptor[]> = {
  ADMIN: [],
  USER: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Personal Details",
      Component: PersonalDetailsStep,
    },
    {
      id: "other",
      title: "Other Info",
      Component: UserPersonalizedDetailsStep,
    },
  ],
  RIDER: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Personal Details",
      Component: PersonalDetailsStep,
    },
    { id: "vehicle", title: "Vehicle Details", Component: RiderVehicleStep },
  ],
  VENDOR: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Personal Details",
      Component: PersonalDetailsStep,
    },
    {
      id: "business",
      title: "Business Details",
      Component: BusinessDetailsStep,
    },
  ],
  INVESTOR: [
    { id: "image", title: "Profile Photo", Component: ImageUploadStep },
    {
      id: "personal",
      title: "Personal Details",
      Component: PersonalDetailsStep,
    },
    {
      id: "investor",
      title: "Investment Details",
      Component: InvestorDetailsStep,
    },
  ],
};

export default function OnboardingWizard({ role }: { role: UserRole }) {
  return (
    <OnboardingProvider initialRole={role}>
      <OnboardingFlow role={role} />
    </OnboardingProvider>
  );
}

/* ────────────────────────────────────────────────
   Onboarding Flow (Per-step update + Progress tracking)
────────────────────────────────────────────────── */
function OnboardingFlow({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const userId = user?.id as number;
  const steps = useMemo(() => roleStepMap[role], [role]);

  const { data: savedProgress, isLoading } = useOnboardingProgress(userId);

  const saveProgressMutation = useSaveOnboardingProgress({
    user: user as User,
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
      console.log("USER ID IN ONBOARDING WIZARD: ", userId);

      saveProgressMutation.mutate({ stepIndex: nextStep });
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
    <div className="max-w-3xl mx-auto sm:p-4">
      <Stepper
        steps={steps.map((s) => s.title)}
        currentStep={currentStep}
        clickable={true}
        animatedBar={true}
        onStepClick={(i) => {
          setCurrentStep(i);
          if (userId) {
            saveProgressMutation.mutate({ stepIndex: i });
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

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import dynamic from "next/dynamic";
// import {
//   OnboardingProvider,
//   UserRole,
//   useOnboarding,
// } from "@/providers/onboarding-provider";
// import ImageUploadStep from "./steps/image-upload-step";
// import PersonalDetailsStep from "./steps/personal-details-step";
// import { toast } from "sonner";
// import { apiRequest } from "@/utils/api-client-utils";
// import Stepper from "./ui/stepper";
// import { useOnboardingProgress } from "@/server/hooks/user/use-onboarding-progress-query";
// import { useSaveOnboardingProgress } from "@/server/hooks/user/use-onboarding-progress-mutation";
// import { useAuth } from "@/providers/auth-provider";

// /**
//  * NOTE:
//  * - Role-specific components are dynamically imported (ssr: false)
//  * - Keep the common steps (ImageUploadStep, PersonalDetailsStep) imported normally
//  * - roleStepDefinitions provides titles and components (some dynamic)
//  */

// const RiderVehicleStep = dynamic(
//   () => import("./steps/steps-role/rider-vehicle-step").then((m) => m.default),
//   { ssr: false }
// );
// const BusinessDetailsStep = dynamic(
//   () =>
//     import("./steps/steps-role/business-details-step").then((m) => m.default),
//   { ssr: false }
// );
// const InvestorDetailsStep = dynamic(
//   () =>
//     import("./steps/steps-role/investor-details-step").then((m) => m.default),
//   { ssr: false }
// );

// /** Step descriptor */
// type StepDescriptor = {
//   id: string;
//   title: string;
//   Component: React.ComponentType<any>;
// };

// /** Map roles -> step descriptors (titles + components) */
// const roleStepMap: Record<UserRole, StepDescriptor[]> = {
//   USER: [
//     { id: "image", title: "Profile Photo", Component: ImageUploadStep },
//     {
//       id: "personal",
//       title: "Personal Details",
//       Component: PersonalDetailsStep,
//     },
//     // add USER-specific steps here
//   ],
//   RIDER: [
//     { id: "image", title: "Profile Photo", Component: ImageUploadStep },
//     {
//       id: "personal",
//       title: "Personal Details",
//       Component: PersonalDetailsStep,
//     },
//     { id: "vehicle", title: "Vehicle Details", Component: RiderVehicleStep },
//   ],
//   VENDOR: [
//     { id: "image", title: "Profile Photo", Component: ImageUploadStep },
//     {
//       id: "personal",
//       title: "Personal Details",
//       Component: PersonalDetailsStep,
//     },
//     {
//       id: "business",
//       title: "Business Details",
//       Component: BusinessDetailsStep,
//     },
//   ],
//   INVESTOR: [
//     { id: "image", title: "Profile Photo", Component: ImageUploadStep },
//     {
//       id: "personal",
//       title: "Personal Details",
//       Component: PersonalDetailsStep,
//     },
//     {
//       id: "investor",
//       title: "Investment Details",
//       Component: InvestorDetailsStep,
//     },
//   ],
// };

// export default function OnboardingWizard({ role }: { role: UserRole }) {
//   return (
//     <OnboardingProvider initialRole={role}>
//       <OnboardingFlow role={role} />
//     </OnboardingProvider>
//   );
// }

// function OnboardingFlow({ role }: { role: UserRole }) {
//   const { user } = useAuth();
//   const userId = user?.id as number;

//   const steps = useMemo(() => roleStepMap[role], [role]);

//   const {
//     data: savedProgress = 0,
//     isLoading,
//     refetch,
//   } = useOnboardingProgress(userId);

//   const saveProgressMutation = useSaveOnboardingProgress();

//   const [currentStep, setCurrentStep] = useState<number>(savedProgress);

//   useEffect(() => {
//     if (!isLoading && typeof savedProgress === "number") {
//       setCurrentStep(savedProgress);
//     }
//   }, [isLoading, savedProgress]);

//   const { state } = useOnboarding();
//   const [index, setIndex] = useState(0);
//   const isLast = index === steps.length - 1;
//   const current = steps[index];

//   const goNext = () => {
//     const nextStep = Math.min(currentStep + 1, steps.length - 1);
//     setCurrentStep(nextStep);

//     if (userId) {
//       saveProgressMutation.mutate({
//         userId,
//         stepIndex: nextStep,
//       });
//     }
//   };

//   const goBack = (to?: number) => {
//     const newStep =
//       typeof to === "number"
//         ? Math.max(0, Math.min(to, steps.length - 1))
//         : Math.max(currentStep - 1, 0);
//     setCurrentStep(newStep);
//   };

//   const finalize = async () => {
//     try {
//       const payload = {
//         role: state.role,
//         avatar: state.uploadedImageUrl,
//         personal: state.personalDetails,
//         roleSpecific: state.roleSpecific,
//       };

//       await apiRequest("/api/onboarding/complete", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       toast.success("Onboarding complete!");
//       // TODO: route to dashboard or success page from host app
//     } catch (err: any) {
//       toast.error(err?.message ?? "Failed to complete onboarding");
//     }
//   };

//   const StepComponent = current.Component;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <Stepper
//         steps={steps.map((s) => s.title)}
//         currentStep={currentStep}
//         clickable={true}
//         animatedBar={true}
//         onStepClick={(i) => {
//           setCurrentStep(i);
//           if (userId) {
//             saveProgressMutation.mutate({ userId, stepIndex: i });
//           }
//         }}
//       />

//       <div className="mt-6 bg-card p-6 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-3">{current.title}</h3>

//         <div>
//           <StepComponent
//             onNext={goNext}
//             onBack={goBack}
//             isLast={isLast}
//             finalize={async () => {
//               // role-specific steps may call finalize or ask flow to finalize
//               if (isLast) await finalize();
//               else goNext();
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
