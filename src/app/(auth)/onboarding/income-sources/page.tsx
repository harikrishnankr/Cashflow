"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import {
  PageFooter,
  IncomeSourceCard,
  IncomeSourceRow,
  INCOME_SOURCES,
} from "@/components/features/auth";
import { useOnboardingData } from "@/components/features/auth/onboarding/onboarding-provider";
import { CURRENCIES } from "@/components/features/auth/onboarding/currency-and-locale/constants";

export default function IncomeSourcesPage() {
  const router = useRouter();
  const {
    currency,
    selectedSources,
    toggleSource,
    incomeAmounts,
    setIncomeAmount,
    incomeFrequencies,
    setIncomeFrequency,
  } = useOnboardingData();

  const currencyGlyph =
    CURRENCIES.find((c) => c.value === currency)?.glyph ?? currency;

  // Exclude "custom" from the detail rows
  const detailSources = INCOME_SOURCES.filter(
    (s) => s.id !== "custom" && selectedSources.includes(s.id),
  );

  const total = detailSources.reduce((sum, s) => {
    const raw = incomeAmounts[s.id]?.replace(/,/g, "") ?? "";
    return sum + (parseFloat(raw) || 0);
  }, 0);

  const [intPart, decPart] = total
    .toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .split(".");

  const handleContinue = () => router.push("/onboarding/setup-finish");

  return (
    <>
      <h1
        className="text-[2rem] md:text-[2.5rem] font-normal tracking-tight leading-[1.1] mb-3 text-(--ink)"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Where does your <em className="text-(--orange)">income</em> come from?
      </h1>
      <p className="text-[0.9375rem] text-(--ink-3) leading-relaxed mb-6">
        Tag the sources you want to track. We&apos;ll pre-fill the income side
        of your ledger and handle recurring deposits for you.
      </p>

      <div className="font-mono text-[0.6875rem] uppercase tracking-widest text-(--ink-3) mb-2.5">
        Pick your sources
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {INCOME_SOURCES.map((source) => (
          <IncomeSourceCard
            key={source.id}
            source={source}
            checked={selectedSources.includes(source.id)}
            onCheckedChange={() => toggleSource(source.id)}
          />
        ))}
      </div>

      {detailSources.length > 0 && (
        <div className="mt-6">
          <div className="font-mono text-[0.6875rem] uppercase tracking-widest text-(--ink-3) mb-2.5">
            Typical monthly · optional
          </div>

          {detailSources.map((source) => (
            <IncomeSourceRow
              key={source.id}
              source={source}
              amount={incomeAmounts[source.id] ?? ""}
              onAmountChange={(v) => setIncomeAmount(source.id, v)}
              frequency={
                incomeFrequencies[source.id] ?? source.defaultFrequency
              }
              onFrequencyChange={(v) => setIncomeFrequency(source.id, v)}
              onRemove={() => toggleSource(source.id)}
              currencyGlyph={currencyGlyph}
            />
          ))}

          <div className="flex justify-between items-baseline mt-3 px-3.5 py-3 bg-(--paper-2) border border-(--hairline) rounded-(--r-md)">
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-(--ink-3)">
              Estimated monthly income
            </span>
            <span
              className="text-[1.25rem] tabular-nums text-(--ink)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-(--ink-3) text-sm">{currencyGlyph}</span>
              {intPart}
              <span className="text-(--ink-3)">.{decPart}</span>
            </span>
          </div>
        </div>
      )}

      <Button fullWidth className="md:hidden mt-8" onClick={handleContinue}>
        Continue <ArrowRight size={16} />
      </Button>

      <PageFooter
        onBack={() => router.push("/onboarding/currency-and-locale")}
        onContinue={handleContinue}
      />
    </>
  );
}
