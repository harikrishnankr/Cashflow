"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui";
import { useOnboardingData } from "@/components/features/auth/onboarding/onboarding-provider";
import { CURRENCIES } from "@/components/features/auth/onboarding/currency-and-locale/constants";
import { INCOME_SOURCES_DATA } from "@/components/features/auth/onboarding/income-sources/constants";
import { useOnboarding } from "@/components/features/auth/hooks/use-auth";
import { IncomeSource, RecurringFrequency } from "@/schema/user";

export default function SetupFinishPage() {
  const router = useRouter();
  const {
    currency,
    locale,
    selectedSources,
    incomeAmounts,
    incomeFrequencies,
  } = useOnboardingData();
  const onboardingMutation = useOnboarding();

  const currencyGlyph =
    CURRENCIES.find((c) => c.value === currency)?.glyph ?? currency;

  const sourceCount = selectedSources.filter((id) => id !== "custom").length;

  const total = INCOME_SOURCES_DATA.filter(
    (s) => s.id !== "custom" && selectedSources.includes(s.id),
  ).reduce((sum, s) => {
    const raw = incomeAmounts[s.id]?.replace(/,/g, "") ?? "";
    return sum + (parseFloat(raw) || 0);
  }, 0);

  const totalStr = `${currencyGlyph} ${total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const summaryRows = [
    { label: "Currency", value: `${currency} · ${currencyGlyph}` },
    { label: "Locale", value: locale },
    { label: "Income sources", value: String(sourceCount) },
    { label: "Est. monthly", value: totalStr, highlight: true },
  ];

  const detailSources = INCOME_SOURCES_DATA.filter(
    (s) => s.id !== "custom" && selectedSources.includes(s.id),
  );

  const finishOnboarding = async () => {
    try {
      await onboardingMutation.mutateAsync({
        currency,
        recurringIncomes: detailSources.map((source) => ({
          source: source.id as IncomeSource,
          description: "Income Source",
          amount: parseFloat(incomeAmounts[source.id]),
          frequency:
            (incomeFrequencies[source.id] as RecurringFrequency) ??
            source.defaultFrequency,
          startDate: new Date().toISOString().slice(0, 10),
        })),
      });
      router.push("/dashboard");
    } catch {}
  };

  return (
    <>
      <div className="md:hidden inset-0 z-50 overflow-y-auto bg-(--ink) text-(--paper) px-6 pt-5 pb-10 flex flex-col">
        {/* Badge */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-(--orange) flex items-center justify-center shrink-0">
            <Check size={17} strokeWidth={2.5} className="text-white" />
          </div>
          <span
            className="text-[11px] uppercase tracking-widest text-(--orange)"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Setup complete
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-[2.25rem] font-normal leading-[1.05] tracking-[-0.02em] mb-2.5 text-(--paper)"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You&apos;re <em className="text-(--orange) not-italic">ready.</em>
        </h1>
        <p
          className="text-[13px] leading-[1.55] mb-6"
          style={{ color: "rgba(250,247,242,0.65)" }}
        >
          Your ledger is live. We&apos;ve pre-populated the month with your
          recurring income.
        </p>

        {/* Summary card */}
        <div
          className="rounded-(--r-md) px-3.5 mb-5"
          style={{
            background: "rgba(250,247,242,0.06)",
            border: "1px solid rgba(250,247,242,0.1)",
          }}
        >
          {summaryRows.map(({ label, value, highlight }) => (
            <div
              key={label}
              className="flex justify-between py-2.5"
              style={{ borderBottom: "1px solid rgba(250,247,242,0.08)" }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "rgba(250,247,242,0.55)",
                }}
              >
                {label}
              </span>
              <span
                className={`text-xs font-medium ${highlight ? "text-(--orange)" : "text-(--paper)"}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <Button fullWidth onClick={finishOnboarding}>
          Open my dashboard <ArrowRight size={16} />
        </Button>
      </div>

      {/* ── Desktop ─────────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        {/* Complete card */}
        <div className="bg-(--ink) border border-(--hairline) rounded-(--r-md) p-8 flex md:flex-col lg:flex-row gap-10 mt-2">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <div
              className="text-[0.625rem] uppercase tracking-widest text-(--orange) mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Welcome aboard
            </div>
            <h2
              className="text-[2rem] font-normal tracking-tight leading-[1.1] mb-3 text-(--paper)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              You&apos;re <em className="text-(--orange)">ready.</em>
            </h2>
            <p className="text-[0.9375rem] text-(--paper) leading-relaxed mb-8 max-w-sm">
              Your CashFlow is configured. Add your first expense in seconds, or
              head straight to the dashboard to get started.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={finishOnboarding}>
                Go to dashboard <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Right — summary */}
          <div className="lg:w-52 shrink-0 lg:border-l lg:border-(--hairline) lg:pl-8">
            {summaryRows.map(({ label, value, highlight }) => (
              <div
                key={label}
                className="flex justify-between items-baseline py-2.5 border-b border-(--hairline) last:border-b-0"
              >
                <span
                  className="text-[0.625rem] uppercase tracking-widest text-(--ink-3)"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </span>
                <span
                  className={`text-xs font-medium ${highlight ? "text-(--orange)" : "text-(--paper)"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav row */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-(--hairline)">
          <button
            type="button"
            onClick={() => router.push("/onboarding/income-sources")}
            className="flex items-center gap-2 text-sm text-(--ink-3) hover:text-(--ink) transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span
            className="text-[0.625rem] uppercase tracking-widest text-(--ink-3)"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            setup · complete
          </span>
        </div>
      </div>
    </>
  );
}
