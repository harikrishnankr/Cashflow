"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui";
import { useOnboardingStep } from "../../onboarding-provider";
import { OnboardingStep, OnboardingStepMap } from "../../constants";

const BACK_ROUTES: Partial<Record<OnboardingStep, string>> = {
  [OnboardingStepMap.CurrencyAndLocale]: "/onboarding/welcome",
  [OnboardingStepMap.IncomeSources]: "/onboarding/currency-and-locale",
  [OnboardingStepMap.SetupFinish]: "/onboarding/income-sources",
};

export function MobileOnboardingHeader() {
  const { currentStep, stepNumber, totalSteps } = useOnboardingStep();
  const total = String(totalSteps).padStart(2, "0");
  const isWelcome = currentStep === OnboardingStepMap.Welcome;
  const backRoute = BACK_ROUTES[currentStep] ?? "/onboarding/welcome";

  return (
    <div className="md:hidden px-6 py-4 flex items-center justify-between">
      {isWelcome ? (
        <Logo className="h-6 w-auto" />
      ) : (
        <Link
          href={backRoute}
          className="w-8 h-8 -ml-2 flex items-center justify-center rounded-(--r-sm) text-(--ink-2) hover:bg-(--paper-2) transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
      )}

      <span
        className="text-[0.6875rem] uppercase tracking-widest text-(--ink-3)"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {stepNumber} / {total}
      </span>

      {isWelcome ? (
        <div className="w-8" />
      ) : (
        <Link
          href="/onboarding/setup-finish"
          className="text-sm text-(--ink-3) hover:text-(--ink) transition-colors"
        >
          Skip
        </Link>
      )}
    </div>
  );
}
