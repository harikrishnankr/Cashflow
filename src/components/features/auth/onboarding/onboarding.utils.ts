import {
  OnboardingStep,
  OnboardingStepMap,
  OrderedOnboardingSteps,
} from "./constants";

export function getStepFromPath(pathname: string): OnboardingStep {
  const segment = pathname.split("/").pop() as OnboardingStep;
  return OrderedOnboardingSteps.includes(segment as OnboardingStep)
    ? (segment as OnboardingStep)
    : OnboardingStepMap.Welcome;
}
