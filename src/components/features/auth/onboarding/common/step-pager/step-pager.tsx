"use client";

import Link from "next/link";
import { OrderedOnboardingSteps } from "../../constants";
import { useOnboardingStep } from "../../onboarding-provider";

export function StepPager() {
  const { currentStep, stepNumber, totalSteps } = useOnboardingStep();

  return (
    <div className="flex items-center justify-between gap-4 mb-10 text-xs text-(--ink-3) uppercase font-mono">
      <span className="hidden md:inline">Step {stepNumber} / {String(totalSteps).padStart(2, "0")}</span>
      <div className="flex items-center gap-2 flex-1 md:flex-none">
        {OrderedOnboardingSteps.map((step) => (
          <span
            key={step}
            className={`flex-1 md:flex-none md:w-7 h-1 rounded-xs transition-colors ${
              step === currentStep ? "bg-(--orange)" : "bg-(--paper-3)"
            }`}
          />
        ))}
      </div>
      <Link
        href="/onboarding/setup-finish"
        className="hidden md:inline normal-case tracking-normal text-sm text-(--ink-3) hover:text-(--ink) transition-colors"
      >
        Skip for now
      </Link>
    </div>
  );
}
