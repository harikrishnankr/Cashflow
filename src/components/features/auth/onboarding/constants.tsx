import {
  Coffee,
  ShoppingCart,
  FileText,
  LucideIcon,
  Zap,
  Layers,
  BellRing,
} from "lucide-react";
import { ReactNode } from "react";

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

export type OnboardingStep =
  (typeof OnboardingStepMap)[keyof typeof OnboardingStepMap];

export const SPARK_HEIGHTS = [
  0.4, 0.55, 0.35, 0.6, 0.45, 0.5, 0.65, 0.5, 0.7, 0.8, 1, 0.6, 0.55, 0.5,
];
export const MAX_BAR_PX = 32;

export const TRANSACTIONS = [
  { Icon: Coffee, label: "Blue Bottle", amount: "-$4.50" },
  { Icon: ShoppingCart, label: "Whole Foods", amount: "-$68.12" },
  { Icon: FileText, label: "Con Edison", amount: "-$94.00" },
];

export const WELCOME_VALUES: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}[] = [
  {
    icon: Zap,
    title: "Log a transaction in 3 seconds",
    description: (
      <>
        Press <b className="font-semibold text-(--ink)">A</b> anywhere. Amount,
        category, done.
      </>
    ),
  },
  {
    icon: Layers,
    title: "One ledger, four time scales",
    description: "Switch day / week / month / year without losing place.",
  },
  {
    icon: BellRing,
    title: "Quiet reminders, not alarms",
    description: "Bill due dates & budget nudges, never gamified.",
  },
];
