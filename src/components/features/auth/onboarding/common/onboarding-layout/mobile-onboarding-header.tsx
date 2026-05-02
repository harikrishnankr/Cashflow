"use client";

import { Logo } from "@/components/ui";
import { useOnboardingStep } from "../../onboarding-provider";

export function MobileOnboardingHeader() {
  const { stepNumber, totalSteps } = useOnboardingStep();
  const total = String(totalSteps).padStart(2, "0");

  return (
    <div className="md:hidden px-6 py-4 flex items-center justify-between">
      <Logo className="h-6 w-auto" dark />
      <span
        className="text-[0.6875rem] uppercase tracking-widest"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {stepNumber} / {total}
      </span>
    </div>
  );
}
