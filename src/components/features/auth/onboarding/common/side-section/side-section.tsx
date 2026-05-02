"use client";

import { Logo } from "@/components/ui";
import { StepList } from "./step-list";
import { useOnboardingStep } from "../../onboarding-provider";

export function SideSection() {
  const { currentStep } = useOnboardingStep();

  return (
    <aside className="hidden md:flex max-w-95 text-(--paper) bg-(--ink) py-10 px-9 flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center mb-10">
        <Logo className="h-7 w-auto" />
      </div>
      <div
        className="flex items-center gap-2.5 mb-4 text-[0.6875rem] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          color: "rgba(250,247,242,0.55)",
        }}
      >
        <span
          className="w-7 h-px"
          style={{ background: "rgba(250,247,242,0.35)" }}
        />
        Get set up
      </div>
      <h2
        className="font-normal m-0 leading-[1.08] tracking-[-0.025em] text-[2.25rem] mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Three quick steps to a <em className="text-(--orange)">calmer</em> ledger.
      </h2>
      <p
        className="leading-[1.55] text-[0.8125rem] mb-11"
        style={{ color: "rgba(250,247,242,0.55)" }}
      >
        We&apos;ll set your currency, add your income sources, and show you the
        first run. Takes about a minute.
      </p>

      <StepList selectedStep={currentStep} />

      <div className="mt-auto font-mono text-(--gray) text-xs flex items-center gap-2 border-t border-(--gray) pt-7">
        <span>v1.4.0</span>
        <span className="bullet" />
        <span>SOC 2 · 256-bit TLS</span>
      </div>
    </aside>
  );
}
