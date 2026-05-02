import { OnboardingStep, OrderedOnboardingSteps } from "../constants";

export function StepPager({ currentStep }: { currentStep: OnboardingStep }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-10 text-xs text-(--ink-3) uppercase font-mono">
      <span>Step 01 / 04</span>
      <div className="flex items-center gap-2">
        {OrderedOnboardingSteps.map((step, index) => (
          <span
            key={index}
            className={`w-7 h-1 rounded-xs ${
              step === currentStep ? "bg-(--orange)" : "bg-(--paper-3)"
            }`}
          />
        ))}
      </div>
      <div></div>
    </div>
  );
}
