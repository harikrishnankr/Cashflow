"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button, Select } from "@/components/ui";
import { PageFooter, CurrencyGrid } from "@/components/features/auth";
import { useOnboardingData } from "@/components/features/auth/onboarding/onboarding-provider";
import {
  LOCALES,
  NUMBER_FORMATS,
} from "@/components/features/auth/onboarding/currency-and-locale/constants";

export default function CurrencyAndLocalePage() {
  const router = useRouter();
  const {
    currency,
    setCurrency,
    locale,
    setLocale,
    numberFormat,
    setNumberFormat,
  } = useOnboardingData();

  const handleContinue = () => router.push("/onboarding/income-sources");

  return (
    <>
      <h1
        className="text-[2rem] md:text-[2.5rem] font-normal tracking-tight leading-[1.1] mb-3 text-(--ink)"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Pick your <em className="text-(--orange)">currency.</em>
      </h1>
      <p className="text-[0.9375rem] text-(--ink-3) leading-relaxed mb-6">
        Everything you log — incomes, expenses, budgets — rolls up in this
        currency. You can change it later from Settings; we won&apos;t
        retro-convert.
      </p>

      <CurrencyGrid value={currency} onValueChange={setCurrency} />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Select
          label="Region / locale"
          value={locale}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setLocale(e.target.value)
          }
          disabled
        >
          {LOCALES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </Select>

        <Select
          label="Number format"
          value={numberFormat}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setNumberFormat(e.target.value)
          }
          disabled
        >
          {NUMBER_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      <Button fullWidth className="md:hidden mt-8" onClick={handleContinue}>
        Continue <ArrowRight size={16} />
      </Button>

      <PageFooter
        onBack={() => router.push("/onboarding/welcome")}
        onContinue={handleContinue}
      />
    </>
  );
}
