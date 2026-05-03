"use client";

import { ReactNode } from "react";
import { SideSection } from "../side-section/side-section";
import { StepPager } from "../step-pager/step-pager";
import { MobileOnboardingHeader } from "./mobile-onboarding-header";
import { OnboardingStepMap } from "../../constants";
import { useOnboardingStep } from "../../onboarding-provider";
import classNames from "classnames";

export function OnboardingLayout({ children }: { children: ReactNode }) {
  const { currentStep } = useOnboardingStep();
  const isFinish = currentStep === OnboardingStepMap.SetupFinish;

  return (
    <div
      className={classNames("min-h-screen flex flex-col md:block md:bg-(--paper) md:text(--ink)", {
        "bg-(--ink) text-(--paper)": isFinish,
      })}
    >
      <MobileOnboardingHeader />
      <div className="flex-1 md:min-h-screen md:grid md:grid-cols-[380px_1fr]">
        <SideSection />
        <main
          className={classNames(
            "md:bg-(--paper) md:text(--ink) w-full max-w-220 py-5 md:py-14 px-6 mx-auto",
            {
              "bg-(--ink) text-(--paper)": isFinish,
            },
          )}
        >
          <StepPager />
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
