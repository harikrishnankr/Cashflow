"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { OnboardingStep, OrderedOnboardingSteps } from "./constants";
import { getStepFromPath } from "./onboarding.utils";

interface OnboardingContextValue {
  // Navigation
  currentStep: OnboardingStep;
  stepIndex: number;
  stepNumber: string;
  totalSteps: number;
  // Currency & locale
  currency: string;
  setCurrency: (v: string) => void;
  locale: string;
  setLocale: (v: string) => void;
  numberFormat: string;
  setNumberFormat: (v: string) => void;
  // Income sources
  selectedSources: string[];
  toggleSource: (id: string) => void;
  incomeAmounts: Record<string, string>;
  setIncomeAmount: (id: string, amount: string) => void;
  incomeFrequencies: Record<string, string>;
  setIncomeFrequency: (id: string, freq: string) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStep = getStepFromPath(pathname);
  const stepIndex = OrderedOnboardingSteps.indexOf(currentStep);
  const stepNumber = String(stepIndex + 1).padStart(2, "0");
  const totalSteps = OrderedOnboardingSteps.length;

  const [currency, setCurrency] = useState("INR");
  const [locale, setLocale] = useState("en-IN");
  const [numberFormat, setNumberFormat] = useState("1,23,456.78");

  const [selectedSources, setSelectedSources] = useState<string[]>(["salary"]);
  const [incomeAmounts, setIncomeAmounts] = useState<Record<string, string>>({});
  const [incomeFrequencies, setIncomeFrequencies] = useState<Record<string, string>>({});

  const toggleSource = useCallback((id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const setIncomeAmount = useCallback((id: string, amount: string) => {
    setIncomeAmounts((prev) => ({ ...prev, [id]: amount }));
  }, []);

  const setIncomeFrequency = useCallback((id: string, freq: string) => {
    setIncomeFrequencies((prev) => ({ ...prev, [id]: freq }));
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        stepIndex,
        stepNumber,
        totalSteps,
        currency,
        setCurrency,
        locale,
        setLocale,
        numberFormat,
        setNumberFormat,
        selectedSources,
        toggleSource,
        incomeAmounts,
        setIncomeAmount,
        incomeFrequencies,
        setIncomeFrequency,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingStep() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboardingStep must be used within OnboardingProvider");
  return ctx;
}

export function useOnboardingData() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboardingData must be used within OnboardingProvider");
  return ctx;
}
