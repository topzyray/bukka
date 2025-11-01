"use client";

import { UserRole } from "@/data/interfaces/Auth";
import React, { createContext, useContext, useState } from "react";

export interface OnboardingState {
  role: UserRole;
  uploadedImageUrl?: string | null;
  uploadedImageFile?: File | null;
  personalDetails?: any;
  roleSpecific?: any;
}

export interface OnboardingActions {
  setUploadedImage: (file: File | null, url?: string | null) => void;
  setPersonalDetails: (payload: any) => void;
  setRoleSpecific: (payload: any) => void;
  reset: () => void;
}

const OnboardingContext = createContext<
  { state: OnboardingState; actions: OnboardingActions } | undefined
>(undefined);

export const OnboardingProvider: React.FC<{
  initialRole: UserRole;
  children: React.ReactNode;
}> = ({ initialRole, children }) => {
  const [state, setState] = useState<OnboardingState>({
    role: initialRole,
    uploadedImageUrl: null,
    uploadedImageFile: null,
  });

  const actions: OnboardingActions = {
    setUploadedImage: (file, url) =>
      setState((s) => ({
        ...s,
        uploadedImageFile: file ?? null,
        uploadedImageUrl: url ?? s.uploadedImageUrl,
      })),
    setPersonalDetails: (payload) =>
      setState((s) => ({ ...s, personalDetails: payload })),
    setRoleSpecific: (payload) =>
      setState((s) => ({ ...s, roleSpecific: payload })),
    reset: () =>
      setState({
        role: initialRole,
        uploadedImageUrl: null,
        uploadedImageFile: null,
      }),
  };

  return (
    <OnboardingContext.Provider value={{ state, actions }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
};
