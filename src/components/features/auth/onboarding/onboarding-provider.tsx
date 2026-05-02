"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { OnboardingStep, OrderedOnboardingSteps } from "./constants";
import { getStepFromPath } from "./onboarding.utils";

interface OnboardingContextValue {
  currentStep: OnboardingStep;
  stepIndex: number;
  stepNumber: string;
  totalSteps: number;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStep = getStepFromPath(pathname);
  const stepIndex = OrderedOnboardingSteps.indexOf(currentStep);
  const stepNumber = String(stepIndex + 1).padStart(2, "0");
  const totalSteps = OrderedOnboardingSteps.length;

  return (
    <OnboardingContext.Provider
      value={{ currentStep, stepIndex, stepNumber, totalSteps }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingStep() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboardingStep must be used within OnboardingProvider");
  }
  return ctx;
}
