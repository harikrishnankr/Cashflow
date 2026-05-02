import { Check } from "lucide-react";
import {
  OnboardingStep,
  OnboardingStepDescriptions,
  OnboardingStepTitles,
  OrderedOnboardingSteps,
} from "../../constants";
import classNames from "classnames";

export function StepList({ selectedStep }: { selectedStep: OnboardingStep }) {
  const getState = (step: OnboardingStep) => {
    const isCompleted =
      OrderedOnboardingSteps.indexOf(step) <
      (selectedStep ? OrderedOnboardingSteps.indexOf(selectedStep) : 0);
    const isSelected = step === selectedStep;

    return {
      isCompleted,
      isSelected,
    };
  };

  const getDotClasses = ({
    isCompleted,
    isSelected,
  }: {
    isCompleted: boolean;
    isSelected: boolean;
  }) => {
    const baseClasses =
      "w-7 h-7 rounded-full border flex items-center justify-center text-xs";

    if (isSelected) {
      return `${baseClasses} bg-(--ink) border-(--orange) bg-(--orange) text-(--paper)`;
    } else if (isCompleted) {
      return `${baseClasses} bg-white border-(--paper)`;
    } else {
      return `${baseClasses} bg-transparent border-(--gray) text-(--gray)`;
    }
  };

  return (
    <div className="flex gap-0.5 flex-col">
      {OrderedOnboardingSteps.map((step, index) => {
        const { isCompleted, isSelected } = getState(step);

        return (
          <div
            key={step}
            className="flex items-start gap-3.5 py-3.5 relative not-first:before:content-[''] not-first:before:absolute not-first:before:-top-2 not-first:before:left-3.25 not-first:before:w-px not-first:before:h-5.5 not-first:before:bg-(--gray)"
          >
            <div className={getDotClasses({ isCompleted, isSelected })}>
              {isCompleted ? <Check size={16} stroke="#000" /> : index + 1}
            </div>
            <div className="text-(--gray)">
              <div className={classNames("text-sm", { "text-(--paper)": isSelected || isCompleted })}>
                {OnboardingStepTitles[step]}
              </div>
              <div className="text-xs mt-0.5">
                {isCompleted ? "Done": OnboardingStepDescriptions[step]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
