import { ReactNode } from "react";
import { SideSection } from "../side-section/side-section";
import { StepPager } from "../step-pager/step-pager";
import { OnboardingStepMap } from "../constants";

export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[380px_1fr]">
      <SideSection />
      <main className="bg-(--paper) w-full max-w-220 py-14 px-20 mx-auto">
        <StepPager currentStep={OnboardingStepMap.CurrencyAndLocale} />
        <div>{children}</div>
      </main>
    </div>
  );
}
