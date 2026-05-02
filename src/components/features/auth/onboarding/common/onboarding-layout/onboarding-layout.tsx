import { ReactNode } from "react";
import { SideSection } from "../side-section/side-section";
import { StepPager } from "../step-pager/step-pager";
import { MobileOnboardingHeader } from "./mobile-onboarding-header";

export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:block">
      <MobileOnboardingHeader />
      <div className="flex-1 md:min-h-screen md:grid md:grid-cols-[380px_1fr]">
        <SideSection />
        <main className="bg-(--paper) w-full max-w-220 py-5 md:py-14 px-6 mx-auto">
          <StepPager />
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
