"use client";

import { useAuth } from "./auth-provider";
import { CircularLoader } from "@/components/loaders/circular-loader";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularLoader
          text="Validating Access..."
          textClassName="animate-pulse-glow rounded-lg px-4"
        />
      </div>
    );
  }

  return <>{children}</>;
};
