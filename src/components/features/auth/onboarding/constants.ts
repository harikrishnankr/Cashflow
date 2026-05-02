export const OnboardingStepMap = {
  Welcome: "welcome",
  CurrencyAndLocale: "currency-and-locale",
  IncomeSources: "income-sources",
  SetupFinish: "setup-finish",
} as const;

export const OrderedOnboardingSteps = [
  OnboardingStepMap.Welcome,
  OnboardingStepMap.CurrencyAndLocale,
  OnboardingStepMap.IncomeSources,
  OnboardingStepMap.SetupFinish,
] as const;

export const OnboardingStepTitles: Record<OnboardingStep, string> = {
  [OnboardingStepMap.Welcome]: "Welcome",
  [OnboardingStepMap.CurrencyAndLocale]: "Currency & Locale",
  [OnboardingStepMap.IncomeSources]: "Income Sources",
  [OnboardingStepMap.SetupFinish]: "You’re all set",
};

export const OnboardingStepDescriptions: Record<OnboardingStep, string> = {
  [OnboardingStepMap.Welcome]: "What CashFlow does",
  [OnboardingStepMap.CurrencyAndLocale]: "Pick your default",
  [OnboardingStepMap.IncomeSources]: "Salary, freelance, other",
  [OnboardingStepMap.SetupFinish]: "Open your dashboard",
};

export type OnboardingStep = (typeof OnboardingStepMap)[keyof typeof OnboardingStepMap];
